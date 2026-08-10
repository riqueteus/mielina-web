import { useEffect, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Spinner,
  Steps,
  Text,
  VStack,
  useSteps,
} from "@chakra-ui/react"
import { FaArrowLeft, FaArrowRight, FaCheck, FaHeartPulse } from "react-icons/fa6"
import { ETAPAS_TRIAGEM, MENSAGEM_IA_ACORDANDO } from "../../config/classification.config"
import {
  campoRespondido,
  montarPayload,
} from "../../lib/classification.util"
import { verificarStatusClassificacao } from "../../services/classification.service"
import type {
  ChaveCampo,
  DadosTriagem,
  RespostaCampo,
  RespostasTriagem,
  StatusServicoIA,
} from "../../types/classification.types"
import PerguntaTriagem from "./PerguntaTriagem"

interface QuestionarioTriagemProps {
  enviando: boolean
  erroEnvio: string | null
  aoSubmeter: (dados: DadosTriagem) => void
}

function QuestionarioTriagem({
  enviando,
  erroEnvio,
  aoSubmeter,
}: QuestionarioTriagemProps) {
  const [respostas, setRespostas] = useState<RespostasTriagem>({})
  const [erros, setErros] = useState<Partial<Record<ChaveCampo, boolean>>>({})
  const [statusIa, setStatusIa] = useState<StatusServicoIA>("verificando")

  const stepper = useSteps({
    count: ETAPAS_TRIAGEM.length,
    defaultStep: 0,
  })

  const etapaAtual = Math.min(stepper.value, ETAPAS_TRIAGEM.length - 1)
  const ultimaEtapa = etapaAtual === ETAPAS_TRIAGEM.length - 1
  const etapa = ETAPAS_TRIAGEM[etapaAtual]

  useEffect(() => {
    const cleanup = verificarStatusClassificacao(setStatusIa)
    return cleanup
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [etapaAtual])

  const etapaValida = (indice: number) =>
    ETAPAS_TRIAGEM[indice].campos.every((campo) =>
      campoRespondido(respostas, campo.campo)
    )

  const mudarResposta = (campo: ChaveCampo, valor: RespostaCampo) => {
    setRespostas((antes) => ({ ...antes, [campo]: valor }))
    setErros((antes) => (antes[campo] ? { ...antes, [campo]: false } : antes))
  }

  const submeter = () => {
    const payload = montarPayload(respostas)
    if (payload) aoSubmeter(payload)
  }

  const avancar = () => {
    const camposPendentes = etapa.campos.filter(
      (campo) => !campoRespondido(respostas, campo.campo)
    )

    if (camposPendentes.length > 0) {
      setErros(() => {
        const proximos: Partial<Record<ChaveCampo, boolean>> = {}
        camposPendentes.forEach((campo) => {
          proximos[campo.campo] = true
        })
        return proximos
      })
      return
    }

    setErros({})

    if (!ultimaEtapa) {
      stepper.goToNextStep()
      return
    }

    submeter()
  }

  const tituloStatusIa =
    statusIa === "verificando" || statusIa === "acordando"
      ? "Preparando a IA de classificação..."
      : statusIa === "pronto"
      ? "IA de classificação pronta."
      : "Não foi possível conectar à IA de classificação."

  return (
    <VStack gap="5" align="stretch" w="100%">
      <HStack gap="3">
        <Icon as={FaHeartPulse} boxSize="8" color="purple.700" />
        <Box>
          <Text fontSize={{ base: "2xl", md: "3xl" }} color="purple.700" fontWeight="bold">
            Triagem (CIS)
          </Text>
          <Text color="gray.600">
            Etapa {etapaAtual + 1} de {ETAPAS_TRIAGEM.length} — {etapa.titulo}
          </Text>
        </Box>
      </HStack>

      <HStack gap="2">
        {statusIa === "pronto" ? (
          <Box w="2" h="2" rounded="full" bg="green.500" flexShrink={0} />
        ) : statusIa === "indisponivel" ? (
          <Box w="2" h="2" rounded="full" bg="red.500" flexShrink={0} />
        ) : (
          <Spinner size="sm" color="purple.500" />
        )}
        <Text fontSize="sm" color="purple.700" fontWeight="medium">
          {tituloStatusIa}
        </Text>
      </HStack>

      {!etapaValida(etapaAtual) && (
        <Text fontSize="sm" color="gray.500">
          Responda todas as perguntas da etapa para continuar.
        </Text>
      )}

      <Box
        bg="white"
        p={{ base: "4", md: "6" }}
        rounded="2xl"
        shadow="lg"
        border="1px solid"
        borderColor="purple.100"
      >
        <Steps.RootProvider value={stepper}>
          <Steps.List>
            {ETAPAS_TRIAGEM.map((etapaItem, indice) => (
              <Steps.Item key={etapaItem.titulo} index={indice}>
                <Steps.Indicator>
                  <Steps.Status complete={<Icon as={FaCheck} />} incomplete={<Steps.Number />} />
                </Steps.Indicator>
                <Steps.Title
                  fontSize={{ base: "xs", md: "sm" }}
                  display={{ base: "none", md: "block" }}
                >
                  {etapaItem.titulo}
                </Steps.Title>
                <Steps.Separator />
              </Steps.Item>
            ))}
          </Steps.List>

          <Steps.Content index={etapaAtual}>
            <VStack gap="6" align="stretch" mt="6">
              {etapa.campos.map((campo) => (
                <PerguntaTriagem
                  key={campo.campo}
                  campo={campo}
                  valor={respostas[campo.campo]}
                  erro={!!erros[campo.campo]}
                  onChange={mudarResposta}
                />
              ))}
            </VStack>
          </Steps.Content>
        </Steps.RootProvider>
      </Box>

      {enviando && (
        <HStack gap="3" bg="purple.50" p="4" rounded="xl" border="1px solid" borderColor="purple.200">
          <Spinner color="purple.600" />
          <Box>
            <Text color="purple.800" fontWeight="600" fontSize="sm">
              Analisando suas respostas...
            </Text>
            <Text color="purple.700" fontSize="xs">
              {MENSAGEM_IA_ACORDANDO}
            </Text>
          </Box>
        </HStack>
      )}

      {erroEnvio && !enviando && (
        <Alert.Root status="error" rounded="xl">
          <Alert.Content>
            <Alert.Title fontSize="sm">Não foi possível concluir a análise</Alert.Title>
            <Alert.Description fontSize="sm">{erroEnvio}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {erroEnvio && !enviando && (
        <Button
          colorScheme="purple"
          size="lg"
          rounded="xl"
          onClick={submeter}
        >
          Tentar novamente
          <Icon as={FaArrowRight} />
        </Button>
      )}

      <Flex justify="space-between" align="center" gap="3">
        <Button
          variant="ghost"
          onClick={stepper.goToPrevStep}
          disabled={!stepper.hasPrevStep || enviando}
          size="lg"
          rounded="xl"
        >
          <Icon as={FaArrowLeft} />
          Voltar
        </Button>

        <Button
          colorScheme="purple"
          size="lg"
          rounded="xl"
          onClick={avancar}
          disabled={enviando}
        >
          {ultimaEtapa ? "Ver resultado" : "Continuar"}
          {!ultimaEtapa && <Icon as={FaArrowRight} />}
        </Button>
      </Flex>
    </VStack>
  )
}

export default QuestionarioTriagem