import { useEffect, useState } from "react"
import { Box, VStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import AvisoTriagem from "../components/triagem/AvisoTriagem"
import QuestionarioTriagem from "../components/triagem/QuestionarioTriagem"
import { useAuth } from "../hooks/useAuth"
import { enviarTriagem } from "../services/classification.service"
import { pingServicosIA } from "../services/ping.service"
import { salvarResultadoLocal } from "../storage/resultados.storage"
import type { DadosTriagem } from "../types/classification.types"
import type { ResultadoTriagemHistorico } from "../types/resultados.types"

type FaseTriagem = "aviso" | "questionario"

function Triagem() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [fase, setFase] = useState<FaseTriagem>("aviso")
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

  useEffect(() => {
    pingServicosIA()
  }, [])

  const aoSubmeter = async (dados: DadosTriagem) => {
    setEnviando(true)
    setErroEnvio(null)

    const previsao = await enviarTriagem(dados)

    if (!previsao.sucesso) {
      setEnviando(false)
      setErroEnvio(
        previsao.erro ||
          "Não foi possível analisar suas respostas no momento. Tente novamente."
      )
      return
    }

    const userId = session?.user.id
    if (userId) {
      const registro: ResultadoTriagemHistorico = {
        id: crypto.randomUUID(),
        tipo: "triagem",
        criadoEm: new Date().toISOString(),
        percentualRisco: previsao.percentualRisco ?? 0,
        nivel: previsao.nivel ?? "baixo",
        mensagem: previsao.mensagem,
      }
      salvarResultadoLocal(userId, registro)
    }

    setEnviando(false)
    navigate("/resultados")
  }

  return (
    <Box p={{ base: "4", md: "8" }} minH="100vh">
      <VStack gap="6" align="stretch" maxW="4xl" mx="auto">
        {fase === "aviso" && (
          <AvisoTriagem onContinuar={() => setFase("questionario")} />
        )}

        {fase === "questionario" && (
          <QuestionarioTriagem
            enviando={enviando}
            erroEnvio={erroEnvio}
            aoSubmeter={aoSubmeter}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Triagem