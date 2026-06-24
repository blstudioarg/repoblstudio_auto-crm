import React from 'react'
import { useData } from '../lib/data.jsx'
import { Ring, Badge, StatCard, Icons } from '../components/ui.jsx'

const healthColor = (h) => h >= 85 ? 'var(--accent)' : h >= 60 ? 'var(--warn)' : 'var(--danger)'

export default function Clientes() {
  const { db } = useData()
  const clients = db.clients
  const active = clients.filter(c => c.status === 'active')
  const mrr = active.reduce((a, c) => a + (c.mrr || 0), 0)
  const arr = mrr * 12
  const avgHealth = Math.round(active.reduce((a, c) => a + c.health_score, 0) / (active.length || 1))

  return (
    <>
      <div className="grid g-4 mb-24">
        <StatCard label="Clientes activos" value={active.length} icon={<Icons.clients />} />
        <StatCard label="MRR" value={`$${mrr}`} unit="USD" delta="ingreso mensual recurrente" deltaUp icon={<Icons.campaigns />} />
        <StatCard label="ARR proyectado" value={`$${arr}`} unit="USD" delta="x12 meses" icon={<Icons.cockpit />} />
        <StatCard label="Salud promedio" value={avgHealth} unit="/100" icon={<Icons.system />} />
      </div>

      <div className="grid g-2">
        {clients.map(c => (
          <div key={c.id} className="card hover">
            <div className="between">
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{c.name}</div>
                <div className="muted fz-13">{c.rubro} · {c.city} · {c.ig_handle}</div>
              </div>
              <div style={{ '--accent': healthColor(c.health_score) }}><Ring value={c.health_score} /></div>
            </div>

            <div className="hr" />
            <div className="grid g-3" style={{ gap: 10 }}>
              <div><div className="muted-3 fz-12">MRR</div><div className="bold">${c.mrr} {c.currency}</div></div>
              <div><div className="muted-3 fz-12">Setup</div><div className="bold">${c.setup_fee}</div></div>
              <div><div className="muted-3 fz-12">Renueva</div><div className="bold">{c.renewal_date}</div></div>
            </div>

            <div className="muted-3 fz-12 mt-16" style={{ marginBottom: 8 }}>Stack del cliente</div>
            <div className="pill-row">
              {Object.entries(c.tech_stack || {}).map(([k, v]) => (
                <Badge key={k} kind={v ? 'approved' : 'draft'}>{v ? '●' : '○'} {k}</Badge>
              ))}
              {c.domain && <Badge kind="pilar">{c.domain}</Badge>}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
