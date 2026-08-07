import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { pingServicosIA } from '../services/ping.service'

let ultimoUsuarioPingado: string | null = null

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)

      if (event === 'SIGNED_OUT') {
        ultimoUsuarioPingado = null
        return
      }

      if (event !== 'SIGNED_IN' || !session?.user?.id) return

      const userId = session.user.id
      if (ultimoUsuarioPingado === userId) return
      ultimoUsuarioPingado = userId

      pingServicosIA()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, loading }
}
