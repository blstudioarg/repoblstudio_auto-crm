import React from 'react'
import { useData } from '../lib/data.jsx'
import { Badge, StatCard, Progress, Icons } from '../components/ui.jsx'

export default function Campanas() {
  const { db } = useData()
  const camps = db.campaigns
  const active = camps.filter(c => c.status === 'active')
  const spent = camps.reduce((a, c) => a + (c.spent || 0), 0)
  const leads = camps.reduce((a, c) => a + (c.leads || 0), 0)
  const dms = camps.reduce((a, c) => a + (c.dms || 0), 0)
  const cpl = leads ? (spent / leads).toFixed(1) : '—'

  return (
    <>
      <div className="grid g-4 mb-24">
        <StatCard label="Campañas activas" value={active.length} icon={<Icons.campaigns />} />
        <StatCard label="Invertido" value={`$${spent}`} unit="USD" icon={<Icons.cockpit />} />
        <StatCard label="Leads" value={leads} delta={`${dms} DMs`} deltaUp icon={<Icons.crm />} />
        <StatCard label="CPL promedio" value={`$${cpl}`} delta="costo por lead" icon={<Icons.clients />} />
      </div>

      <div className="grid" style={{ gap: 16 }}>
        {camps.map(c => {
          const pct = c.budget_total ? Math.round((c.spent / c.budget_total) * 100) : 0
          const ctr = c.impressions ? ((c.clicks / c.impressions) * 100).toFixed(2) : '0'
          return (
            <div key={c.id} className="card hover">
              <div className="between mb-16">
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>{c.name}</div>
                  <div className="muted fz-13">{c.type} · {c.objective} · {c.start_date} → {c.end_date}</div>
                </div>
                <Badge kind={c.status === 'active' ? 'active' : c.status === 'paused' ? 'paused' : 'draft'}>{c.status}</Badge>
              </div>

              <div className="grid" style={{ gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
                {[['Alcance', c.reach.toLocaleString()], ['Impresiones', c.impressions.toLocaleString()],
                  ['Clicks', `${c.clicks} · ${ctr}%`], ['DMs', c.dms], ['Leads', c.leads], ['CPL', c.cpl ? `$${c.cpl}` : '—']].map(([k, v]) => (
                  <div key={k}><div className="muted-3 fz-12">{k}</div><div className="bold" style={{ fontSize: 15 }}>{v}</div></div>
                ))}
              </div>

              <div className="mt-16">
                <div className="between fz-12 muted" style={{ marginBottom: 6 }}>
                  <span>Presupuesto gastado</span><span>${c.spent} / ${c.budget_total} ({pct}%)</span>
                </div>
                <Progress value={pct} />
              </div>
              {c.notes && <div className="muted-3 fz-12 mt-16">{c.notes}</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}
