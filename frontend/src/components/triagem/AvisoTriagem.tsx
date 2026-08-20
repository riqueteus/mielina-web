import {
  Alert,
  Box,
  Button,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react"
import { FaArrowRight, FaHeartPulse, FaCircleCheck } from "react-icons/fa6"
import { AVISO_TRIAGEM, ETAPAS_TRIAGEM } from "../../config/classification.config"

interface AvisoTriagemProps {
  onContinuar: () => void
}

function AvisoTriagem({ onContinuar }: AvisoTriagemProps) {
  return (
    <VStack gap="5" align="stretch" w="100%">
      <HStack gap="3">
        <Icon as={FaHeartPulse} boxSize="8" color="#7c3aed" />
        <Text fontSize={{ base: "2xl", md: "3xl" }} color="#7c3aed" fontWeight="bold">
          Triagem (CIS)
        </Text>
      </HStack>

      <Box
        bg="white"
        p={{ base: "6", md: "8" }}
        rounded="2xl"
        shadow="lg"
        border="1px solid"
        borderColor="purple.100"
      >
        <VStack gap="4" align="stretch">
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {AVISO_TRIAGEM.titulo}
          </Text>

          <Text color="gray.600" lineHeight="1.6">
            {AVISO_TRIAGEM.descricao}
          </Text>

          <VStack align="stretch" gap="2">
            {AVISO_TRIAGEM.pontos.map((ponto) => (
              <HStack key={ponto} gap="3" align="flex-start">
                <Icon as={FaCircleCheck} color="purple.500" boxSize="5" mt="0.5" flexShrink={0} />
                <Text color="gray.700" fontSize="sm" lineHeight="1.5">
                  {ponto}
                </Text>
              </HStack>
            ))}
          </VStack>

          <HStack gap="2" flexWrap="wrap">
            <Text color="gray.500" fontSize="sm">
              O questionário é dividido em{" "}
              <strong>{ETAPAS_TRIAGEM.length} etapas</strong>:
            </Text>
            {ETAPAS_TRIAGEM.map((etapa, indice) => (
              <Box
                key={etapa.titulo}
                bg="purple.50"
                color="purple.700"
                fontSize="xs"
                fontWeight="600"
                px="3"
                py="1"
                rounded="full"
              >
                {indice + 1}. {etapa.titulo}
              </Box>
            ))}
          </HStack>

          <Alert.Root status="warning" rounded="xl">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title fontSize="sm">Atenção</Alert.Title>
              <Alert.Description fontSize="sm">
                Este questionário <strong>não substitui a orientação e o
                diagnóstico médico</strong>. A estimativa gerada é apenas um
                indicativo para apoiar a conversa com seu profissional de saúde.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <Button
            colorScheme="purple"
            size="lg"
            rounded="xl"
            onClick={onContinuar}
          >
            {AVISO_TRIAGEM.botao}
            <Icon as={FaArrowRight} />
          </Button>
        </VStack>
      </Box>
    </VStack>
  )
}

export default AvisoTriagem