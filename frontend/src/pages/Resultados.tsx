import { useMemo } from "react"
import { Box, Button, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { FaChartLine, FaFileLines } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import ResultadoCard from "../components/resultados/ResultadoCard"
import ResultadoTriagem from "../components/triagem/ResultadoTriagem"
import { useAuth } from "../hooks/useAuth"
import { carregarResultados } from "../storage/resultados.storage"
import type { ResultadoTriagemHistorico } from "../types/resultados.types"

function Resultados() {
  const { session } = useAuth()
  const navigate = useNavigate()

  const userId = session?.user.id

  const resultados = useMemo(
    () => (userId ? carregarResultados(userId) : []),
    [userId]
  )

  const ultimo = resultados[0] as ResultadoTriagemHistorico | undefined
  const anteriores = resultados.slice(1)

  return (
    <Box p={{ base: "4", md: "8" }} minH="100vh">
      <VStack gap="6" align="stretch" maxW="4xl" mx="auto">
        <HStack gap="3">
          <Icon as={FaFileLines} boxSize="7" color="purple.700" />
          <Box>
            <Text fontSize={{ base: "2xl", md: "3xl" }} color="purple.700" fontWeight="bold">
              Resultados
            </Text>
            <Text color="gray.500">
              Suas análises de triagem e ressonância ficam salvas aqui.
            </Text>
          </Box>
        </HStack>

        {!ultimo ? (
          <Box
            bg="white"
            p={{ base: "8", md: "12" }}
            rounded="2xl"
            shadow="lg"
            border="1px solid"
            borderColor="purple.100"
            textAlign="center"
          >
            <Icon as={FaChartLine} boxSize="10" color="purple.300" />
            <Text mt="4" fontSize="lg" fontWeight="600" color="gray.800">
              Você ainda não tem resultados
            </Text>
            <Text mt="1" color="gray.500">
              Quando você concluir uma triagem ou análise de ressonância, o
              resultado aparecerá aqui.
            </Text>
            <Button
              colorScheme="purple"
              size="lg"
              rounded="xl"
              mt="6"
              onClick={() => navigate("/triagem")}
            >
              Fazer triagem
            </Button>
          </Box>
        ) : (
          <>
            <VStack gap="4" align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="600" color="purple.700">
                  Último resultado
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Este é o resultado mais recente da sua análise.
                </Text>
              </Box>
              <ResultadoTriagem
                resultado={ultimo}
                onNovaTriagem={() => navigate("/triagem")}
              />
            </VStack>

            {anteriores.length > 0 && (
              <VStack gap="4" align="stretch" mt="2">
                <HStack gap="2">
                  <Text fontSize="sm" fontWeight="600" color="purple.700">
                    Histórico
                  </Text>
                  <Box
                    bg="purple.50"
                    color="purple.700"
                    fontSize="xs"
                    fontWeight="600"
                    px="2"
                    py="0.5"
                    rounded="full"
                  >
                    {anteriores.length}{anteriores.length === 1 ? " anterior" : " anteriores"}
                  </Box>
                </HStack>
                {anteriores.map((resultado) => (
                  <ResultadoCard key={resultado.id} resultado={resultado} />
                ))}
              </VStack>
            )}
          </>
        )}
      </VStack>
    </Box>
  )
}

export default Resultados