import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  Spinner,
  Alert,
  Icon,
} from '@chakra-ui/react';
import { FiSend, FiPlus } from 'react-icons/fi';

import type { Mensagem, StatusRag } from '../types/chat.types';
import { MENSAGEM_BOAS_VINDAS, MENSAGEM_INICIALIZACAO_IA } from '../config/chat.config';
import { carregarHistoricoAPI, limparHistoricoAPI, salvarMensagemAPI } from '../services/chat-historico.service';
import { verificarStatusIA, enviarPergunta } from '../services/chat.service';

export default function Chatbot({ userId }: { userId: string }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [statusRag, setStatusRag] = useState<StatusRag>('verificando');
  const scrollRef = useRef<HTMLDivElement>(null);
  const perguntaPendenteRef = useRef<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Seguro de fato: NENHUM dado sensível no localStorage, só Postgres com RLS
  useEffect(() => {
    carregarHistoricoAPI()
      .then((historico) => {
        setMensagens(historico);
      })
      .catch(() => {
        // offline ou erro: mantém vazio, não usa localStorage pra dado sensível
      });
  }, [userId]);

  useEffect(() => {
    const cleanup = verificarStatusIA(setStatusRag);
    return cleanup;
  }, []);

  const criarNovoChat = async () => {
    if (carregando) return;
    try {
      await limparHistoricoAPI();
      setMensagens([]);
    } catch (err) {
      console.warn('[mielina] Falha ao criar novo chat:', err);
    }
  };

  const enviarPerguntaHandler = async (e: FormEvent) => {
    e.preventDefault();
    const pergunta = input.trim();
    if (!pergunta || carregando) return;

    const idUsuario = Date.now();
    const msgUsuario = { id: idUsuario, tipo: 'usuario' as const, texto: pergunta };
    setMensagens((antes) => [...antes, msgUsuario]);
    // Seguro: salva no Supabase (RLS) além do localStorage
    salvarMensagemAPI({ tipo: 'usuario', texto: pergunta }).catch((err) => {
      console.warn('[mielina] Falha ao salvar pergunta:', err);
    });
    setInput('');
    setCarregando(true);
    perguntaPendenteRef.current = pergunta;

    const resultado = await enviarPergunta(pergunta);

    if (resultado.sucesso) {
      const idIA = Date.now() + 1;
      const msgIA = {
        id: idIA,
        tipo: 'ia' as const,
        texto: resultado.resposta || '(Sem resposta)',
        fontes: resultado.fontes,
      };
      setMensagens((antes) => [...antes, msgIA]);
      salvarMensagemAPI({ tipo: 'ia', texto: msgIA.texto, fontes: msgIA.fontes }).catch((err) => {
        console.warn('[mielina] Falha ao salvar resposta:', err);
      });

      if (statusRag !== 'pronto') {
        setStatusRag('pronto');
      }
    } else {
      const idErro = Date.now() + 1;
      setMensagens((antes) => [
        ...antes,
        {
          id: idErro,
          tipo: 'sistema',
          texto: ` ${resultado.erro}\n\nA IA pode estar ainda acordando. Tente novamente em alguns segundos ou clique em "Enviar" de novo — ela já deve estar respondendo!`,
        },
      ]);
    }

    setCarregando(false);
    perguntaPendenteRef.current = null;
  };

  const textoLoading =
    statusRag === 'acordando'
      ? 'Acordando a IA (leva ~30-60s na 1ª vez)...'
      : 'Pensando...';

  return (
    <VStack gap="4" align="stretch" w="100%">
      <VStack gap="2" align="stretch" w="100%">
        <HStack justify="space-between" align="center">
          <HStack gap="2" align="center">
            {statusRag === 'pronto' ? (
              <Box w="2" h="2" rounded="full" bg="green.500" flexShrink={0} />
            ) : statusRag === 'indisponivel' ? (
              <Box w="2" h="2" rounded="full" bg="red.500" flexShrink={0} />
            ) : (
              <Spinner size="sm" color="purple.500" />
            )}
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={
                statusRag === 'indisponivel'
                  ? 'red.600'
                  : statusRag === 'pronto'
                  ? 'purple.700'
                  : 'purple.700'
              }
            >
              {statusRag === 'verificando'
                ? MENSAGEM_INICIALIZACAO_IA
                : statusRag === 'acordando'
                ? MENSAGEM_INICIALIZACAO_IA
                : statusRag === 'pronto'
                ? 'IA pronta para responder.'
                : 'Não foi possível conectar à IA. Tente novamente em alguns instantes.'}
            </Text>
          </HStack>
          <Button
            size="md"
            variant="ghost"
            colorScheme="purple"
            onClick={criarNovoChat}
            disabled={carregando || mensagens.length === 0}
            title="Começar novo chat do zero"
          >
            <Icon as={FiPlus} mr="1" />
            Novo chat
          </Button>
        </HStack>

        <Alert.Root status="info" variant="subtle" rounded="md" size="sm" bg="blue.50" border="1px solid" borderColor="blue.100">
          <Alert.Content px="2" py="1">
            <Alert.Description fontSize="md" color="blue.700">
              Este chat não tem memória entre perguntas e tem caráter informativo, não substitui um profissional de saúde. Cada pergunta é analisada de forma independente. Use o botão "Novo chat" para começar outro chat do zero.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </VStack>

      <Box
        border="1px solid"
        borderColor="purple.100"
        shadow="lg"
        rounded="2xl"
        overflow="hidden"
        bg="white"
      >
        <Box
          ref={scrollRef}
          h="500px"
          overflowY="auto"
          p="6"
          bgGradient="linear-gradient(180deg, #faf5ff 0%, #ffffff 60%)"
        >
          <VStack gap="4" align="stretch">
            <MensagemItem key={MENSAGEM_BOAS_VINDAS.id} mensagem={MENSAGEM_BOAS_VINDAS} />
            {mensagens.map((msg) => (
              <MensagemItem key={msg.id} mensagem={msg} />
            ))}
            {carregando && (
              <HStack gap="3" justify="flex-start" align="flex-start">
                <Avatar.Root size="md">
                  <Avatar.Fallback bg="sky.500" color="blue.700">
                    IA
                  </Avatar.Fallback>
                </Avatar.Root>
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="purple.100"
                  rounded="2xl"
                  roundedTopLeft="none"
                  px="4"
                  py="3"
                  shadow="sm"
                >
                  <HStack gap="2">
                    <Spinner size="sm" color="purple.500" />
                    <Text color="purple.600" fontSize="sm">
                      {textoLoading}
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            )}
          </VStack>
        </Box>

        <Box
          as="form"
          onSubmit={enviarPerguntaHandler}
          p="4"
          borderTop="1px solid"
          borderColor="purple.50"
          bg="white"
        >
          <HStack gap="2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta aqui..."
              disabled={carregando}
              size="lg"
              rounded="2xl"
              borderColor="purple.200"
              _focus={{
                borderColor: 'purple.500',
                boxShadow: '0 0 0 3px rgba(168,85,247,0.15)',
              }}
            />
            <Button
              type="submit"
              disabled={carregando || !input.trim()}
              colorScheme="purple"
              size="lg"
              rounded="2xl"
              px="6"
            >
              <Icon as={FiSend} />
            </Button>
          </HStack>
        </Box>
      </Box>
    </VStack>
  );
}

function MensagemItem({ mensagem }: { mensagem: Mensagem }) {
  const isUsuario = mensagem.tipo === 'usuario';
  const isSistema = mensagem.tipo === 'sistema';

  if (isSistema) {
    return (
      <Alert.Root status="info" variant="subtle" rounded="xl" size="sm">
        <Alert.Content flex="1" px="3" py="2">
          <Alert.Description fontSize="sm" whiteSpace="pre-wrap" lineHeight="1.6">
            {mensagem.texto}
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    );
  }

  return (
    <HStack
      gap="3"
      justify={isUsuario ? 'flex-end' : 'flex-start'}
      align="flex-start"
    >
      {!isUsuario && (
        <Avatar.Root size="sm">
          <Avatar.Fallback bg="sky.500" color="blue.700">
            IA
          </Avatar.Fallback>
        </Avatar.Root>
      )}

      <Box
        maxW="80%"
        bg={isUsuario ? 'purple.600' : 'white'}
        color={isUsuario ? 'white' : 'gray.800'}
        border={!isUsuario ? '1px solid' : 'none'}
        borderColor="purple.100"
        rounded="2xl"
        roundedTopRight={isUsuario ? 'none' : '2xl'}
        roundedTopLeft={!isUsuario ? 'none' : '2xl'}
        px="4"
        py="3"
        shadow="sm"
      >
        <Text whiteSpace="pre-wrap" fontSize="sm" lineHeight="1.6">
          {mensagem.texto}
        </Text>

        {mensagem.fontes && mensagem.fontes.length > 0 && (
          <Box mt="3" pt="3" borderTop="1px dashed" borderColor="purple.100">
            <Text fontSize="xs" color="purple.500" mb="1" fontWeight="bold">
              📚 Fontes:
            </Text>
            <VStack gap="1" align="stretch">
              {mensagem.fontes.map((fonte, i) => (
                <Text
                  key={i}
                  fontSize="xs"
                  color="purple.600"
                  fontStyle="italic"
                >
                  • {fonte}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </Box>

      {isUsuario && (
        <Avatar.Root size="md">
          <Avatar.Fallback bg="sky.500" color="blue.700">
            VC
          </Avatar.Fallback>
        </Avatar.Root>
      )}
    </HStack>
  );
}
