import { Box, HStack, Icon, Spinner, Text, VStack } from "@chakra-ui/react"
import { FaChartPie } from "react-icons/fa6"
import type { DistribuicaoRegiao } from "../../types/laudo.types"

interface GraficoDistribuicaoProps {
  dados: DistribuicaoRegiao[]
  carregando: boolean
}

function ConteudoDistribuicao({ dados }: { dados: DistribuicaoRegiao[] }) {
  if (dados.length === 0) {
    return <Text color="gray.500">Sem dados ainda.</Text>
  }

  const maximo = Math.max(1, ...dados.map((d) => d.quantidade))

  return (
    <VStack gap="3" align="stretch">
      {dados.map((d) => (
        <Box key={d.regiao}>
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            {d.regiao} — {d.quantidade}
          </Text>
          <Box bg="purple.100" rounded="md" h="8px" mt="1">
            <Box
              bg="purple.600"
              rounded="md"
              h="8px"
              width={`${Math.round((d.quantidade / maximo) * 100)}%`}
            />
          </Box>
        </Box>
      ))}
    </VStack>
  )
}

function GraficoDistribuicao({ dados, carregando }: GraficoDistribuicaoProps) {
  return (
    <Box bg="white" p="5" rounded="2xl" shadow="lg" border="1px solid" borderColor="purple.100">
      <HStack gap="2">
        <Icon as={FaChartPie} color="purple.700" />
        <Text fontWeight="600" color="gray.800">
          Distribuição por região
        </Text>
      </HStack>
      <Box mt="4">
        {carregando ? <Spinner color="purple.500" /> : <ConteudoDistribuicao dados={dados} />}
      </Box>
    </Box>
  )
}

export default GraficoDistribuicao