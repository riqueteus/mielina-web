import { useCallback, useEffect, useState } from "react"
import {
  excluirLaudo,
  listarLaudos,
  obterDistribuicaoRegioes,
  obterEvolucaoLesoes,
} from "../services/laudo.service"
import type {
  DistribuicaoRegiao,
  Laudo,
  PontoEvolucaoLesoes,
} from "../types/laudo.types"

export function useLaudos() {
  const [laudos, setLaudos] = useState<Laudo[]>([])
  const [evolucao, setEvolucao] = useState<PontoEvolucaoLesoes[]>([])
  const [distribuicao, setDistribuicao] = useState<DistribuicaoRegiao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [erroExclusao, setErroExclusao] = useState<string | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const lista = await listarLaudos()
        if (!ativo) return
        setLaudos(lista)

        if (lista.length === 0) {
          setEvolucao([])
          setDistribuicao([])
          setErro(null)
          return
        }

        const [evolucaoDados, distribuicaoDados] = await Promise.allSettled([
          obterEvolucaoLesoes(),
          obterDistribuicaoRegioes(),
        ])
        if (!ativo) return

        setEvolucao(evolucaoDados.status === "fulfilled" ? evolucaoDados.value : [])
        setDistribuicao(distribuicaoDados.status === "fulfilled" ? distribuicaoDados.value : [])
      } catch (err) {
        if (!ativo) return
        setErro(err instanceof Error ? err.message : "Falha ao carregar os laudos.")
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()

    return () => {
      ativo = false
    }
  }, [versao])

  const recarregar = useCallback(() => setVersao((v) => v + 1), [])

  const excluir = useCallback(
    async (id: string): Promise<boolean> => {
      setExcluindo(true)
      setErroExclusao(null)

      try {
        await excluirLaudo(id)
        recarregar()
        return true
      } catch (err) {
        setErroExclusao(err instanceof Error ? err.message : "Não foi possível excluir o laudo.")
        return false
      } finally {
        setExcluindo(false)
      }
    },
    [recarregar]
  )

  return {
    laudos,
    evolucao,
    distribuicao,
    carregando,
    erro,
    erroExclusao,
    excluindo,
    recarregar,
    excluir,
  }
}