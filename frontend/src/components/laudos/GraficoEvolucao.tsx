import { Box, HStack, Icon, Spinner, Text, VStack } from "@chakra-ui/react"
import { FaChartColumn } from "react-icons/fa6"
import type { PontoEvolucaoLesoes } from "../../types/laudo.types"
import { formatarDataSimples } from "../../lib/date.util"

interface GraficoEvolucaoProps {
  dados: PontoEvolucaoLesoes[]
  carregando: boolean
}

function ConteudoEvolucao({ dados }: { dados: PontoEvolucaoLesoes[] }) {
  if (dados.length === 0) {
    return <Text color="gray.500">Sem dados ainda.</Text>
  }

  const maximo = Math.max(1, ...dados.map((d) => d.quantidade_lesoes))

  return (
    <HStack align="flex-end" gap="3" minH="160px">
      {dados.map((d) => (
        <VStack key={d.data_exame} flex="1" gap="1">
          <Text fontSize="xs" fontWeight="bold" color="gray.700">
            {d.quantidade_lesoes}
          </Text>
          <Box
            w="full"
            bg="purple.500"
            roundedTop="md"
            height={`${Math.round((d.quantidade_lesoes / maximo) * 100)}px`}
            minH="4px"
          />
          <Text fontSize="xs" color="gray.500" textAlign="center">
            {formatarDataSimples(d.data_exame)}
          </Text>
        </VStack>
      ))}
    </HStack>
  )
}

function GraficoEvolucao({ dados, carregando }: GraficoEvolucaoProps) {
  return (
    <Box bg="white" p="5" rounded="2xl" shadow="lg" border="1px solid" borderColor="purple.100">
      <HStack gap="2">
        <Icon as={FaChartColumn} color="purple.700" />
        <Text fontWeight="600" color="gray.800">
          Evolução das lesões
        </Text>
      </HStack>
      <Box mt="4">
        {carregando ? <Spinner color="purple.500" /> : <ConteudoEvolucao dados={dados} />}
      </Box>
    </Box>
  )
}

export default GraficoEvolucao