import { useEffect, useState } from "react"
import { Box, VStack } from "@chakra-ui/react"
import AvisoTriagem from "../components/triagem/AvisoTriagem"
import QuestionarioTriagem from "../components/triagem/QuestionarioTriagem"
import ResultadoTriagem from "../components/triagem/ResultadoTriagem"
import { enviarTriagem } from "../services/classification.service"
import { pingServicosIA } from "../services/ping.service"
import type {
  DadosTriagem,
  ResultadoPrevisao,
} from "../types/classification.types"

type FaseTriagem = "aviso" | "questionario" | "resultado"

function Triagem() {
  const [fase, setFase] = useState<FaseTriagem>("aviso")
  const [resultado, setResultado] = useState<ResultadoPrevisao | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [codigoQuestionario, setCodigoQuestionario] = useState(0)

  useEffect(() => {
    pingServicosIA()
  }, [])

  const aoSubmeter = async (dados: DadosTriagem) => {
    setEnviando(true)
    setErroEnvio(null)

    const previsao = await enviarTriagem(dados)

    setEnviando(false)

    if (previsao.sucesso) {
      setResultado(previsao)
      setFase("resultado")
      return
    }

    setErroEnvio(
      previsao.erro ||
        "Não foi possível analisar suas respostas no momento. Tente novamente."
    )
  }

  const refazer = () => {
    setResultado(null)
    setErroEnvio(null)
    setCodigoQuestionario((antes) => antes + 1)
    setFase("questionario")
  }

  return (
    <Box p={{ base: "4", md: "8" }} minH="100vh">
      <VStack gap="6" align="stretch" maxW="4xl" mx="auto">
        {fase === "aviso" && <AvisoTriagem onContinuar={() => setFase("questionario")} />}

        {fase === "questionario" && (
          <QuestionarioTriagem
            key={codigoQuestionario}
            enviando={enviando}
            erroEnvio={erroEnvio}
            aoSubmeter={aoSubmeter}
          />
        )}

        {fase === "resultado" && resultado && (
          <ResultadoTriagem resultado={resultado} onRefazer={refazer} />
        )}
      </VStack>
    </Box>
  )
}

export default Triagem