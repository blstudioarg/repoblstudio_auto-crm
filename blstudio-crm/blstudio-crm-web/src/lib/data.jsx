import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, HAS_SUPABASE } from './supabase.js'
import { DEMO } from '../data/demo.js'

const TABLES = ['posts', 'prospects', 'clients', 'campaigns', 'next_actions', 'system_status']
const DataCtx = createContext(null)
export const useData = () => useContext(DataCtx)

// clon profundo del demo para poder mutar en memoria
const freshDemo = () => JSON.parse(JSON.stringify({
  posts: DEMO.posts, prospects: DEMO.prospects, clients: DEMO.clients,
  campaigns: DEMO.campaigns, next_actions: DEMO.next_actions, system_status: DEMO.system_status,
}))

export function DataProvider({ children }) {
  const [db, setDb] = useState(freshDemo())
  const [loading, setLoading] = useState(HAS_SUPABASE)

  // Carga inicial desde Supabase (si está configurado)
  useEffect(() => {
    if (!HAS_SUPABASE) return
    let active = true
    ;(async () => {
      const next = {}
      for (const t of TABLES) {
        const { data } = await supabase.from(t).select('*')
        next[t] = data || []
      }
      if (active) { setDb(next); setLoading(false) }
    })()
    // Realtime: cualquier cambio refresca la tabla afectada
    const ch = supabase.channel('crm-all')
    for (const t of TABLES) {
      ch.on('postgres_changes', { event: '*', schema: 'public', table: t }, async () => {
        const { data } = await supabase.from(t).select('*')
        setDb(prev => ({ ...prev, [t]: data || [] }))
      })
    }
    ch.subscribe()
    return () => { active = false; supabase.removeChannel(ch) }
  }, [])

  const update = useCallback(async (table, id, patch) => {
    setDb(prev => ({ ...prev, [table]: prev[table].map(r => r.id === id ? { ...r, ...patch } : r) }))
    if (HAS_SUPABASE) await supabase.from(table).update(patch).eq('id', id)
  }, [])

  const insert = useCallback(async (table, row) => {
    const tmp = { id: 'tmp-' + Math.random().toString(36).slice(2), ...row }
    setDb(prev => ({ ...prev, [table]: [tmp, ...prev[table]] }))
    if (HAS_SUPABASE) await supabase.from(table).insert(row)
  }, [])

  return (
    <DataCtx.Provider value={{ db, loading, update, insert, live: HAS_SUPABASE }}>
      {children}
    </DataCtx.Provider>
  )
}
