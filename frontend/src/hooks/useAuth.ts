import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { pingServicosIA } from '../services/ping.service'
import {
  salvarSessaoNoBackend,
  restaurarSessaoDoBackend,
  encerrarSessaoNoBackend,
} from '../services/sessao.service'

let ultimoUsuarioPingado: string | null = null
let restauracaoIniciada: Promise<void> | null = null

function ehCallbackOAuth(): boolean {
  if (window.location.hash.includes('access_token')) return true
  return new URLSearchParams(window.location.search).has('code')
}

async function restaurarSessao(): Promise<void> {
  if (ehCallbackOAuth()) return

  const sessao = await restaurarSessaoDoBackend()
  if (!sessao) return

  await supabase.auth.setSession({
    access_token: sessao.access_token,
    refresh_token: sessao.refresh_token,
  })
}

function iniciarRestauracao(): Promise<void> {
  if (!restauracaoIniciada) {
    restauracaoIniciada = restaurarSessao()
  }
  return restauracaoIniciada
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    iniciarRestauracao().finally(() => {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session)
        setLoading(false)
      })
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)

      if (event === 'SIGNED_OUT') {
        ultimoUsuarioPingado = null
        encerrarSessaoNoBackend()
        return
      }

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.refresh_token) {
        salvarSessaoNoBackend(session.refresh_token)
      }

      if ((event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') || !session?.user?.id) return

      const userId = session.user.id
      if (ultimoUsuarioPingado === userId) return
      ultimoUsuarioPingado = userId

      pingServicosIA()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, loading }
}
