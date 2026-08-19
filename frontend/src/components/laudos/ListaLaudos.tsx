import { Alert, Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react"
import type { Laudo } from "../../types/laudo.types"
import CardLaudo from "./CardLaudo"

interface ListaLaudosProps {
  laudos: Laudo[]
  carregando: boolean
  erroExclusao: string | null
  onExcluir: (laudo: Laudo) => void
}

function ListaLaudos({ laudos, carregando, erroExclusao, onExcluir }: ListaLaudosProps) {
  return (
    <Box
      bg="white"
      p={{ base: "5", md: "6" }}
      rounded="2xl"
      shadow="lg"
      border="1px solid"
      borderColor="purple.100"
    >
      <Text fontSize="lg" fontWeight="600" color="gray.800" mb="4">
        Laudos salvos
      </Text>

      {erroExclusao && (
        <Alert.Root status="error" rounded="xl" mb="4">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description fontSize="sm">{erroExclusao}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {carregando ? (
        <HStack gap="2">
          <Spinner color="purple.500" />
          <Text color="gray.500">Carregando laudos...</Text>
        </HStack>
      ) : laudos.length === 0 ? (
        <Text color="gray.500">
          Nenhum laudo enviado ainda. Envie o primeiro PDF acima.
        </Text>
      ) : (
        <VStack gap="3" align="stretch">
          {laudos.map((laudo) => (
            <CardLaudo key={laudo.id} laudo={laudo} onExcluir={onExcluir} />
          ))}
        </VStack>
      )}
    </Box>
  )
}

export default ListaLaudos