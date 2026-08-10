import { Box, HStack, Input, RadioGroup, SimpleGrid, Text } from "@chakra-ui/react"
import type { CampoPergunta } from "../../config/classification.config"
import type { ChaveCampo, RespostaCampo } from "../../types/classification.types"

interface PerguntaTriagemProps {
  campo: CampoPergunta
  valor?: RespostaCampo
  erro?: boolean
  onChange: (campo: ChaveCampo, valor: RespostaCampo) => void
}

function PerguntaTriagem({ campo, valor, erro, onChange }: PerguntaTriagemProps) {
  const mostrarErro = erro && (valor === undefined || valor === "")

  if (campo.tipo === "numero") {
    return (
      <Box as="fieldset" border="none" p="0" m="0">
        <Text as="legend" fontWeight="600" color="gray.800">
          {campo.pergunta}
        </Text>
        {campo.ajuda && (
          <Text fontSize="sm" color="gray.500" mt="1">
            {campo.ajuda}
          </Text>
        )}

        <HStack mt="3" gap="2" align="center">
          <Input
            type="number"
            min={campo.minimo}
            max={campo.maximo}
            placeholder={campo.rotuloNumero}
            value={valor ?? ""}
            onChange={(e) => {
              const texto = e.target.value
              const numero = Number(texto)
              onChange(
                campo.campo,
                texto === "" || Number.isNaN(numero) ? "" : numero
              )
            }}
            aria-invalid={mostrarErro}
            size="lg"
            rounded="xl"
            borderColor={mostrarErro ? "red.300" : "purple.200"}
            _focus={{
              borderColor: "purple.500",
              boxShadow: "0 0 0 3px rgba(168,85,247,0.15)",
            }}
            flex="1"
            maxW="xs"
          />
          {campo.unidade && (
            <Text color="gray.500" whiteSpace="nowrap">
              {campo.unidade}
            </Text>
          )}
        </HStack>
        {mostrarErro && (
          <Text color="red.500" fontSize="sm" mt="1">
            Preencha um valor entre {campo.minimo} e {campo.maximo}.
          </Text>
        )}
      </Box>
    )
  }

  const possuiDescricao = campo.opcoes?.some((opcao) => opcao.descricao)
  const colunas =
    campo.opcoes && campo.opcoes.length <= 3
      ? { base: 1, sm: campo.opcoes.length }
      : { base: 1, md: 2 }
  const valorTexto = valor !== undefined && valor !== "" ? String(valor) : ""

  return (
    <Box as="fieldset" border="none" p="0" m="0">
      <Text as="legend" fontWeight="600" color="gray.800">
        {campo.pergunta}
      </Text>
      {campo.ajuda && (
        <Text fontSize="sm" color="gray.500" mt="1">
          {campo.ajuda}
        </Text>
      )}

      <Box mt="3">
        <RadioGroup.Root
          value={valorTexto}
          onValueChange={(detalhe) =>
            onChange(campo.campo, Number(detalhe.value))
          }
          colorPalette="purple"
          size="lg"
        >
          <SimpleGrid columns={colunas} gap="3">
            {campo.opcoes?.map((opcao) => {
              const marcada = valorTexto === String(opcao.valor)

              return (
                <RadioGroup.Item
                  key={opcao.valor}
                  value={String(opcao.valor)}
                  w="100%"
                  px="4"
                  py="3"
                  rounded="xl"
                  borderWidth="1px"
                  borderColor={marcada ? "purple.500" : "gray.200"}
                  bg={marcada ? "purple.50" : "white"}
                  boxShadow={marcada ? "0 0 0 1px purple.500" : "none"}
                  cursor="pointer"
                  transition="background-color 0.15s, border-color 0.15s, box-shadow 0.15s"
                >
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemControl />
                  <Box>
                    <RadioGroup.ItemText fontWeight="600" color="gray.800">
                      {opcao.rotulo}
                    </RadioGroup.ItemText>
                    {possuiDescricao && opcao.descricao && (
                      <Text fontSize="xs" color="gray.500" mt="0.5">
                        {opcao.descricao}
                      </Text>
                    )}
                  </Box>
                </RadioGroup.Item>
              )
            })}
          </SimpleGrid>
        </RadioGroup.Root>
        {mostrarErro && (
          <Text color="red.500" fontSize="sm" mt="2">
            Selecione uma das opções para continuar.
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default PerguntaTriagem