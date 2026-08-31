import { useState } from "react"
import { Box, VStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import AvisoTriagem from "../components/triagem/AvisoTriagem"
import QuestionarioTriagem from "../components/triagem/QuestionarioTriagem"
import { enviarTriagem } from "../services/classification.service"
import { salvarTriagemAPI } from "../services/triagem-historico.service"
import type { DadosTriagem, NivelRisco } from "../types/classification.types"

type FaseTriagem = "aviso" | "questionario"

function Triagem() {
  const navigate = useNavigate()
  const [fase, setFase] = useState<FaseTriagem>("aviso")
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

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

    // Seguro de fato: NENHUM dado sensível no localStorage, só Supabase com RLS
    // Antes salvava local, agora só no Postgres igual aos laudos
    await salvarTriagemAPI({
      percentualRisco: previsao.percentualRisco ?? 0,
      nivel: (previsao.nivel ?? "baixo") as NivelRisco,
      mensagem: previsao.mensagem,
      payload: dados,
    }).catch(() => {})

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