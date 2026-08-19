import { Button, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { FaFilePdf, FaTrashCan } from "react-icons/fa6"
import type { Laudo } from "../../types/laudo.types"
import { formatarDataSimples } from "../../lib/date.util"

interface CardLaudoProps {
  laudo: Laudo
  onExcluir: (laudo: Laudo) => void
}

function CardLaudo({ laudo, onExcluir }: CardLaudoProps) {
  return (
    <HStack
      gap="4"
      align="flex-start"
      justify="space-between"
      flexWrap="wrap"
      bg="purple.50"
      p="4"
      rounded="xl"
    >
      <VStack align="stretch" gap="1" flex="1" minW="200px">
        <Text fontWeight="bold" color="gray.800">
          {formatarDataSimples(laudo.data_exame)}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {laudo.tipo_exame || "Sem tipo de exame"}
        </Text>
        <Text fontSize="sm" color="purple.700">
          <b>{laudo.quantidade_lesoes}</b>{" "}
          {laudo.quantidade_lesoes === 1 ? "lesão" : "lesões"}
        </Text>
      </VStack>

      <HStack gap="2">
        {laudo.pdf_url_assinado && (
          <Button asChild colorScheme="purple" variant="outline" size="sm" rounded="lg">
            <a href={laudo.pdf_url_assinado} target="_blank" rel="noreferrer">
              <Icon as={FaFilePdf} />
              Ver PDF
            </a>
          </Button>
        )}
        <Button
          colorScheme="red"
          variant="ghost"
          size="sm"
          rounded="lg"
          onClick={() => onExcluir(laudo)}
        >
          <Icon as={FaTrashCan} />
          Excluir
        </Button>
      </HStack>
    </HStack>
  )
}

export default CardLaudo