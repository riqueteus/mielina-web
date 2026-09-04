import { useEffect, useState } from "react"
import { Alert, Box, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import CabecalhoLaudos from "../components/laudos/CabecalhoLaudos"
import FormEnvioLaudo from "../components/laudos/FormEnvioLaudo"
import GraficoDistribuicao from "../components/laudos/GraficoDistribuicao"
import GraficoEvolucao from "../components/laudos/GraficoEvolucao"
import ListaLaudos from "../components/laudos/ListaLaudos"
import DialogoExcluirLaudo from "../components/laudos/DialogoExcluirLaudo"
import { useLaudos } from "../hooks/useLaudos"
import { verificarStatusLaudo } from "../services/laudo.service"
import { MENSAGEM_INICIALIZACAO_IA } from "../config/chat.config"
import type { StatusServicoIA } from "../types/classification.types"
import type { Laudo } from "../types/laudo.types"

function Laudos() {
  const { laudos, evolucao, distribuicao, carregando, erro, erroExclusao, excluindo, recarregar, excluir } =
    useLaudos()
  const [laudoParaExcluir, setLaudoParaExcluir] = useState<Laudo | null>(null)
  const [statusIa, setStatusIa] = useState<StatusServicoIA>("verificando")

  useEffect(() => {
    const cleanup = verificarStatusLaudo(setStatusIa)
    return cleanup
  }, [])

  async function confirmarExclusao() {
    if (!laudoParaExcluir) return
    const ok = await excluir(laudoParaExcluir.id)
    if (ok) setLaudoParaExcluir(null)
  }

  return (
    <Box p={{ base: "4", md: "8" }} minH="100vh">
      <VStack gap="6" align="stretch" maxW="5xl" mx="auto">
        <CabecalhoLaudos />

        {statusIa !== "pronto" && (
          <HStack gap="3" bg="purple.50" p="4" rounded="xl" border="1px solid" borderColor="purple.200">
            {statusIa === "indisponivel" ? (
              <Box w="2" h="2" rounded="full" bg="red.500" flexShrink={0} />
            ) : (
              <Spinner size="sm" color="purple.500" />
            )}
            <Text fontSize="sm" color="purple.700">
              {statusIa === "indisponivel"
                ? "Não foi possível conectar à IA de laudos. Tente novamente em alguns instantes."
                : MENSAGEM_INICIALIZACAO_IA}
            </Text>
          </HStack>
        )}

        {erro && (
          <Alert.Root status="error" rounded="xl">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description fontSize="sm">{erro}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <FormEnvioLaudo onEnviado={recarregar} />

        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
          <GraficoEvolucao dados={evolucao} carregando={carregando} />
          <GraficoDistribuicao dados={distribuicao} carregando={carregando} />
        </SimpleGrid>

        <ListaLaudos
          laudos={laudos}
          carregando={carregando}
          erroExclusao={erroExclusao}
          onExcluir={setLaudoParaExcluir}
        />
      </VStack>

      <DialogoExcluirLaudo
        laudo={laudoParaExcluir}
        excluindo={excluindo}
        onCancelar={() => setLaudoParaExcluir(null)}
        onConfirmar={confirmarExclusao}
      />
    </Box>
  )
}

export default Laudos