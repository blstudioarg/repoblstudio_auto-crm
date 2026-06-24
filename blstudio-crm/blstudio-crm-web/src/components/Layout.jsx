import React from 'react'
import { Logo, LogoMark, Icons } from './ui.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { useData } from '../lib/data.jsx'

const NAV = [
  { id: 'cockpit', label: 'Cockpit', icon: Icons.cockpit },
  { id: 'contenido', label: 'Contenido', icon: Icons.content },
  { id: 'crm', label: 'CRM', icon: Icons.crm },
  { id: 'clientes', label: 'Clientes', icon: Icons.clients },
  { id: 'campanas', label: 'Campañas', icon: Icons.campaigns },
  { id: 'sistema', label: 'Sistema', icon: Icons.system },
]

const CRUMB = {
  cockpit: 'Briefing diario', contenido: 'Calendario y producción', crm: 'Pipeline de ventas',
  clientes: 'Clientes activos', campanas: 'Meta Ads', sistema: 'Estado del stack',
}
const TITLE = {
  cockpit: 'Cockpit', contenido: 'Contenido', crm: 'CRM', clientes: 'Clientes', campanas: 'Campañas', sistema: 'Sistema',
}

export default function Layout({ page, setPage, children }) {
  const { user, signOut, live } = useAuth()
  const { live: dataLive } = useData()
  const name = user?.user_metadata?.name || 'Socio'
  const initial = name[0]?.toUpperCase() || 'B'

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <LogoMark />
          <Logo size={20} />
        </div>
        {NAV.map(n => (
          <button key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
            <span className="nav-ico"><n.icon /></span>{n.label}
          </button>
        ))}
        <div className="nav-spacer" />
        <div className="nav-foot">
          <div className="user-chip">
            <div className="avatar">{initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{user?.email}</div>
            </div>
            <button className="nav-ico" title="Salir" onClick={signOut} style={{ color: 'var(--text-3)' }}><Icons.logout /></button>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <div className="crumb">{CRUMB[page]}</div>
            <h2>{TITLE[page]}</h2>
          </div>
          {!dataLive && (
            <span className="demo-pill"><i className="dot" /> Modo demo · sin Supabase conectado</span>
          )}
        </div>
        <div className="content fade-in">{children}</div>
      </main>
    </div>
  )
}
