import { Button, Dialog, Spinner, Text } from "@chakra-ui/react"
import type { Laudo } from "../../types/laudo.types"
import { formatarDataSimples } from "../../lib/date.util"

interface DialogoExcluirLaudoProps {
  laudo: Laudo | null
  excluindo: boolean
  onCancelar: () => void
  onConfirmar: () => void
}

function DialogoExcluirLaudo({
  laudo,
  excluindo,
  onCancelar,
  onConfirmar,
}: DialogoExcluirLaudoProps) {
  return (
    <Dialog.Root
      open={laudo !== null}
      onOpenChange={(e) => !e.open && !excluindo && onCancelar()}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Excluir laudo?</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text color="gray.600">
              O laudo de <b>{formatarDataSimples(laudo?.data_exame ?? null)}</b> será excluído
              permanentemente, incluindo o PDF e as lesões extraídas. Essa ação não pode
              ser desfeita.
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={onCancelar} disabled={excluindo}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={onConfirmar} disabled={excluindo}>
              {excluindo ? <Spinner size="sm" /> : "Excluir"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

export default DialogoExcluirLaudo