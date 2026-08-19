import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import {
  Alert,
  Box,
  Button,
  Icon,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { FaFilePdf, FaUpload } from "react-icons/fa6"
import { enviarLaudoPDF } from "../../services/laudo.service"

interface FormEnvioLaudoProps {
  onEnviado: () => void
}

function FormEnvioLaudo({ onEnviado }: FormEnvioLaudoProps) {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function aoSelecionarArquivo(e: ChangeEvent<HTMLInputElement>) {
    const escolhido = e.target.files?.[0] ?? null
    if (escolhido && !/\.pdf$/i.test(escolhido.name)) {
      setErro("O arquivo deve ser um PDF.")
      setArquivo(null)
      return
    }
    setErro(null)
    setArquivo(escolhido)
  }

  async function aoEnviar(e: FormEvent) {
    e.preventDefault()
    if (!arquivo || enviando) return

    setEnviando(true)
    setErro(null)

    const resultado = await enviarLaudoPDF(arquivo)

    setEnviando(false)
    setArquivo(null)

    if (!resultado.sucesso) {
      setErro(resultado.erro || "Não foi possível enviar o laudo.")
      return
    }

    onEnviado()
  }

  return (
    <Box
      as="form"
      onSubmit={aoEnviar}
      bg="white"
      p={{ base: "5", md: "8" }}
      rounded="2xl"
      shadow="lg"
      border="1px solid"
      borderColor="purple.100"
    >
      <Text fontSize="lg" fontWeight="600" color="gray.800">
        Enviar laudo
      </Text>
      <Text fontSize="sm" color="gray.500" mt="1">
        A IA pode demorar até 2 minutos na primeira vez. Máximo de 15 MB.
      </Text>

      <VStack gap="3" align="stretch" mt="4">
        <Box
          as="label"
          cursor="pointer"
          border="1px dashed"
          borderColor={arquivo ? "purple.400" : "purple.200"}
          rounded="lg"
          px="4"
          py="3"
          display="flex"
          alignItems="center"
          gap="3"
          bg="purple.50/40"
          _hover={{ borderColor: "purple.500", bg: "purple.50/70" }}
        >
          <Input
            type="file"
            accept="application/pdf"
            onChange={aoSelecionarArquivo}
            display="none"
          />
          <Icon as={FaFilePdf} color="purple.600" />
          <Text fontSize="sm" color={arquivo ? "gray.800" : "gray.500"}>
            {arquivo ? `${arquivo.name} arquivo escolhido` : "Escolher arquivo"}
          </Text>
        </Box>

        {erro && (
          <Alert.Root status="error" rounded="xl">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description fontSize="sm">{erro}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <Button
          type="submit"
          colorScheme="purple"
          size="lg"
          rounded="xl"
          disabled={!arquivo || enviando}
        >
          {enviando ? (
            <>
              <Spinner size="sm" />
              Extraindo informações...
            </>
          ) : (
            <>
              <Icon as={FaUpload} />
              Enviar laudo
            </>
          )}
        </Button>
      </VStack>
    </Box>
  )
}

export default FormEnvioLaudo