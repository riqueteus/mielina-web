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
import { FiSend } from 'react-icons/fi';

import type { Mensagem, StatusRag } from '../types/chat.types';
import { MENSAGEM_BOAS_VINDAS } from '../config/chat.config';
import { carregarHistorico, salvarHistorico } from '../storage/chat.storage';
import { verificarStatusIA, enviarPergunta } from '../services/chat.service';

export default function Chatbot({ userId }: { userId: string }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(() => carregarHistorico(userId));
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

  useEffect(() => {
    salvarHistorico(userId, mensagens);
  }, [mensagens, userId]);

  useEffect(() => {
    const cleanup = verificarStatusIA(setStatusRag);
    return cleanup;
  }, []);

  const enviarPerguntaHandler = async (e: FormEvent) => {
    e.preventDefault();
    const pergunta = input.trim();
    if (!pergunta || carregando) return;

    const idUsuario = Date.now();
    setMensagens((antes) => [
      ...antes,
      { id: idUsuario, tipo: 'usuario', texto: pergunta },
    ]);
    setInput('');
    setCarregando(true);
    perguntaPendenteRef.current = pergunta;

    const resultado = await enviarPergunta(pergunta);

    if (resultado.sucesso) {
      const idIA = Date.now() + 1;
      setMensagens((antes) => [
        ...antes,
        {
          id: idIA,
          tipo: 'ia',
          texto: resultado.resposta || '(Sem resposta)',
          fontes: resultado.fontes,
        },
      ]);

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
              ? 'Inicializando IA...'
              : statusRag === 'acordando'
              ? 'Inicializando IA...'
              : statusRag === 'pronto'
              ? 'IA pronta para responder.'
              : 'Não foi possível conectar à IA. Tente novamente em alguns instantes.'}
          </Text>
        </HStack>

        <Text
          fontSize="md"
          color="gray.100"
          lineHeight="1.5"
          fontStyle="italic"
          px="3"
          py="2"
          bg="#2563eb"
          rounded="md"
          borderLeft="2px solid"
          borderColor="#2563eb"
        >
          Este chatbot tem caráter informativo e não substitui a orientação, o
          diagnóstico ou o tratamento realizado por um profissional de saúde.
        </Text>
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
