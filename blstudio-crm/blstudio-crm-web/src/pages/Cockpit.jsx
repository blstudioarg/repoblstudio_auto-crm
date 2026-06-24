import React from 'react'
import { useData } from '../lib/data.jsx'
import { StatCard, StatusBadge, Icons, Badge } from '../components/ui.jsx'

const TAG = { urgent: { t: 'Urgente', c: 'var(--danger)' }, soon: { t: 'Pronto', c: 'var(--warn)' }, later: { t: 'Después', c: 'var(--text-3)' } }

export default function Cockpit({ setPage }) {
  const { db, update } = useData()
  const { posts, prospects, clients, campaigns, next_actions } = db

  const mrr = clients.filter(c => c.status === 'active').reduce((a, c) => a + (c.mrr || 0), 0)
  const pendientes = posts.filter(p => ['draft', 'copy_ready', 'image_ready'].includes(p.status)).length
  const enPipeline = prospects.filter(p => p.stage !== 'closed').length
  const activos = clients.filter(c => c.status === 'active').length
  const leadsCamp = campaigns.reduce((a, c) => a + (c.leads || 0), 0)

  const toApprove = posts.filter(p => ['copy_ready', 'image_ready'].includes(p.status)).slice(0, 5)
  const actions = [...next_actions].sort((a, b) => Number(a.done) - Number(b.done))

  return (
    <>
      <div className="grid g-4 mb-24">
        <StatCard label="MRR activo" value={`$${mrr}`} unit="USD/mes" delta={`${activos} clientes activos`} deltaUp icon={<Icons.clients />} />
        <StatCard label="Posts pendientes" value={pendientes} delta="de aprobar/producir" icon={<Icons.content />} />
        <StatCard label="En pipeline" value={enPipeline} delta="prospectos abiertos" icon={<Icons.crm />} />
        <StatCard label="Leads de Ads" value={leadsCamp} delta="este mes" deltaUp icon={<Icons.campaigns />} />
      </div>

      <div className="grid g-2">
        {/* Próximas acciones */}
        <div className="card">
          <div className="card-title">Próximas acciones <Badge kind="arc">{actions.filter(a => !a.done).length} abiertas</Badge></div>
          <div className="row-list">
            {actions.map(a => (
              <label key={a.id} className="lrow" style={{ gridTemplateColumns: 'auto 1fr auto', cursor: 'pointer', opacity: a.done ? 0.45 : 1 }}>
                <input type="checkbox" checked={a.done} onChange={() => update('next_actions', a.id, { done: !a.done })}
                  style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
                <span className="nm" style={{ textDecoration: a.done ? 'line-through' : 'none' }}>{a.text}</span>
                <span className="fz-12" style={{ color: TAG[a.tag].c }}>{TAG[a.tag].t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Esperando aprobación */}
        <div className="card">
          <div className="card-title">Esperando tu aprobación
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('contenido')}>Ver calendario</button>
          </div>
          {toApprove.length === 0 && <div className="empty-state">Todo al día ✦</div>}
          <div className="row-list">
            {toApprove.map(p => (
              <div key={p.id} className="lrow" style={{ gridTemplateColumns: '1fr auto auto' }}>
                <div>
                  <div className="nm">Día {p.dia_narrativo} · {p.topic}</div>
                  <div className="mut">{p.hook.slice(0, 54)}…</div>
                </div>
                <StatusBadge status={p.status} />
                <button className="btn btn-primary btn-sm" onClick={() => update('posts', p.id, { status: 'approved' })}>
                  <Icons.check /> Aprobar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline mini */}
      <div className="section-title">Pipeline de hoy</div>
      <div className="grid g-3">
        <div className="card">
          <div className="card-title">Renovaciones próximas</div>
          {clients.map(c => (
            <div key={c.id} className="lrow" style={{ gridTemplateColumns: '1fr auto' }}>
              <span className="nm">{c.name}</span>
              <span className="mut">vence {c.renewal_date}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Prospectos calientes</div>
          {prospects.filter(p => ['discovery', 'reach', 'forge'].includes(p.stage)).map(p => (
            <div key={p.id} className="lrow" style={{ gridTemplateColumns: '1fr auto' }}>
              <span className="nm">{p.name}</span>
              <Badge kind="arc">{p.stage}</Badge>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Campañas activas</div>
          {campaigns.filter(c => c.status === 'active').map(c => (
            <div key={c.id}>
              <div className="between"><span className="nm">{c.name}</span><Badge kind="active">activa</Badge></div>
              <div className="mut fz-12 mt-8">{c.leads} leads · CPL ${c.cpl} · gastado ${c.spent}/{c.budget_total}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
