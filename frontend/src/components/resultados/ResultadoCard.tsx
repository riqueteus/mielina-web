import type { CSSProperties } from "react"
import { Box, HStack, ProgressCircle, Text } from "@chakra-ui/react"
import { formatarDataHora } from "../../lib/date.util"
import { VISUAL_RISCO } from "./visual-risco"
import type { ResultadoHistorico } from "../../types/resultados.types"

interface ResultadoCardProps {
  resultado: ResultadoHistorico
}

function rotuloTipo(tipo: ResultadoHistorico["tipo"]): string {
  if (tipo === "ressonancia") return "Ressonância"
  return "Triagem (CIS)"
}

function ResultadoCard({ resultado }: ResultadoCardProps) {
  const isTriagem = resultado.tipo === "triagem"
  const percentual = isTriagem ? resultado.percentualRisco : 0
  const visual = isTriagem ? VISUAL_RISCO[resultado.nivel] : undefined

  return (
    <Box
      bg="white"
      rounded="2xl"
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
      p="4"
    >
      <HStack gap="4" align="center">
        <ProgressCircle.Root
          value={percentual}
          colorPalette={visual?.paleta ?? "gray"}
        >
          <ProgressCircle.Circle
            style={
              {
                "--size": "48px",
                "--thickness": "5px",
              } as CSSProperties
            }
          >
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
          <ProgressCircle.ValueText
            color="gray.800"
            fontSize="xs"
            fontWeight="bold"
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {isTriagem ? `${percentual}%` : "—"}
          </ProgressCircle.ValueText>
        </ProgressCircle.Root>

        <Box flex="1">
          <HStack gap="2" flexWrap="wrap">
            <Text fontWeight="600" color="gray.800">
              {rotuloTipo(resultado.tipo)}
            </Text>
            {visual && (
              <Box
                bg={visual.corBadge}
                color={visual.corBadgeTexto}
                fontSize="xs"
                fontWeight="600"
                px="2"
                py="0.5"
                rounded="full"
              >
                {visual.rotulo}
              </Box>
            )}
          </HStack>
          <Text fontSize="sm" color="gray.500">
            {formatarDataHora(resultado.criadoEm)}
          </Text>
          {"mensagem" in resultado && resultado.mensagem && (
            <Text
              fontSize="xs"
              color="gray.400"
              mt="1"
              lineClamp={2}
              fontStyle="italic"
            >
              {resultado.mensagem}
            </Text>
          )}
        </Box>
      </HStack>
    </Box>
  )
}

export default ResultadoCard