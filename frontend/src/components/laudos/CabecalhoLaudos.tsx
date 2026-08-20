import { Alert, Box, HStack, Icon, Text } from "@chakra-ui/react"
import { FaFileMedical } from "react-icons/fa6"

function CabecalhoLaudos() {
  return (
    <>
      <HStack gap="3">
        <Icon as={FaFileMedical} boxSize="7" color="#0d9488" />
        <Box>
          <Text fontSize={{ base: "2xl", md: "3xl" }} color="#0d9488" fontWeight="bold">
            Meus Laudos
          </Text>
          <Text color="gray.500">
            Envie um laudo de ressonância magnética em PDF para a IA extrair as
            informações e acompanhe a evolução.
          </Text>
        </Box>
      </HStack>

      <Alert.Root status="info" rounded="xl">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description fontSize="sm" color="gray.600">
            Este painel é um apoio para acompanhar a evolução da esclerose múltipla e
            <b> não substitui a orientação de profissionais de saúde</b>. Leve essas
            informações ao seu médico para conversarem e analisarem juntos a evolução da
            doença.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </>
  )
}

export default CabecalhoLaudos