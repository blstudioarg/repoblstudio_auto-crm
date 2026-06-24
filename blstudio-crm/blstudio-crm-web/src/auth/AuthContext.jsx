import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, HAS_SUPABASE } from '../lib/supabase.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!HAS_SUPABASE)

  useEffect(() => {
    if (!HAS_SUPABASE) return
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null); setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!HAS_SUPABASE) {
      // Modo demo: cualquier credencial entra
      const name = (email || 'socio').split('@')[0]
      setUser({ email: email || 'demo@blstudio.com', user_metadata: { name, role: 'admin' } })
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    if (HAS_SUPABASE) await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, ready, signIn, signOut, live: HAS_SUPABASE }}>
      {children}
    </AuthCtx.Provider>
  )
}
