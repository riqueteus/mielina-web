import type { CSSProperties } from "react"
import {
  Alert,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  ProgressCircle,
  Text,
  VStack,
} from "@chakra-ui/react"
import { FaArrowRight, FaHeartPulse } from "react-icons/fa6"
import { formatarDataHora } from "../../lib/date.util"
import { VISUAL_RISCO } from "../resultados/visual-risco"
import type { ResultadoTriagemHistorico } from "../../types/resultados.types"

interface ResultadoTriagemProps {
  resultado: ResultadoTriagemHistorico
  onNovaTriagem: () => void
}

function ResultadoTriagem({ resultado, onNovaTriagem }: ResultadoTriagemProps) {
  const percentual = resultado.percentualRisco
  const visual = VISUAL_RISCO[resultado.nivel]

  return (
    <VStack gap="5" align="stretch" w="100%">
      <HStack gap="3">
        <Icon as={FaHeartPulse} boxSize="8" color="purple.700" />
        <Box>
          <Text fontSize={{ base: "2xl", md: "3xl" }} color="purple.700" fontWeight="bold">
            Resultado da triagem
          </Text>
          <Text fontSize="sm" color="gray.500">
            Realizada em {formatarDataHora(resultado.criadoEm)}
          </Text>
        </Box>
      </HStack>

      <Box
        bg="white"
        p={{ base: "6", md: "8" }}
        rounded="2xl"
        shadow="lg"
        border="1px solid"
        borderColor="purple.100"
        textAlign="center"
      >
        <Text fontSize="lg" fontWeight="600" color="gray.800">
          Possibilidade de evolução para Esclerose Múltipla
        </Text>

        <Flex justify="center" mt="6">
          <ProgressCircle.Root value={percentual} colorPalette={visual.paleta}>
            <ProgressCircle.Circle
              style={
                {
                  "--size": "170px",
                  "--thickness": "15px",
                } as CSSProperties
              }
            >
              <ProgressCircle.Track />
              <ProgressCircle.Range />
            </ProgressCircle.Circle>
            <ProgressCircle.ValueText
              color="gray.800"
              fontSize="3xl"
              fontWeight="bold"
              position="absolute"
              inset="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {percentual}%
            </ProgressCircle.ValueText>
          </ProgressCircle.Root>
        </Flex>

        <Flex justify="center" mt="5">
          <Box
            bg={visual.corBadge}
            color={visual.corBadgeTexto}
            fontWeight="bold"
            fontSize="sm"
            px="4"
            py="1"
            rounded="full"
          >
            {visual.rotulo}
          </Box>
        </Flex>

        <Text mt="4" color="gray.600" lineHeight="1.6">
          {visual.descricao}
        </Text>

        {resultado.mensagem && (
          <Text mt="3" fontSize="sm" color="gray.500" fontStyle="italic">
            {resultado.mensagem}
          </Text>
        )}
      </Box>

      <Alert.Root status="warning" rounded="xl">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title fontSize="sm">Importante</Alert.Title>
          <Alert.Description fontSize="sm">
            Este resultado é uma estimativa gerada por inteligência artificial e{" "}
            <strong>
              não substitui a orientação, o diagnóstico ou o tratamento médico
            </strong>
            . Consulte sempre um profissional de saúde.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Button
        colorScheme="purple"
        size="lg"
        rounded="xl"
        w="full"
        onClick={onNovaTriagem}
      >
        Nova triagem
        <Icon as={FaArrowRight} />
      </Button>
    </VStack>
  )
}

export default ResultadoTriagem