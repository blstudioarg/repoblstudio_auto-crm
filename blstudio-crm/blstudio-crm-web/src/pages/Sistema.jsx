import React, { useState } from 'react'
import { useData } from '../lib/data.jsx'
import { Badge, StatCard, Modal, Icons } from '../components/ui.jsx'

const TOOL_LABEL = {
  canva_mcp: 'Canva MCP',
  nanobanana: 'NanoBanana',
  n8n: 'n8n',
  meta_api: 'Meta Graph API',
  higgsfield: 'Higgsfield',
  remotion: 'Remotion',
  supabase: 'Supabase',
}
const toolLabel = (t) => TOOL_LABEL[t] || t

const daysTo = (date) => {
  if (!date) return null
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
}

export default function Sistema() {
  const { db, update } = useData()
  const tools = db.system_status
  const [editing, setEditing] = useState(null)

  const connectedCount = tools.filter(t => t.connected).length
  const costMonth = tools.reduce((a, t) => a + (Number(t.cost_month) || 0), 0)
  const expiringSoon = tools.filter(t => {
    const d = daysTo(t.expires_at)
    return d !== null && d <= 15
  })

  const saveEdit = (patch) => {
    update('system_status', editing.id, patch)
    setEditing(null)
  }

  return (
    <>
      <div className="grid g-4 mb-24">
        <StatCard label="Herramientas conectadas" value={`${connectedCount}/${tools.length}`} icon={<Icons.system />} />
        <StatCard label="Costo mensual" value={`$${costMonth}`} unit="USD" icon={<Icons.campaigns />} />
        <StatCard
          label="Vencimientos próximos"
          value={expiringSoon.length}
          delta={expiringSoon.length ? `${expiringSoon.map(t => toolLabel(t.tool)).join(', ')}` : 'todo en orden'}
          deltaUp={!expiringSoon.length}
          icon={<Icons.cockpit />}
        />
        <StatCard label="Sin integrar" value={tools.length - connectedCount} icon={<Icons.crm />} />
      </div>

      <div className="grid g-3">
        {tools.map(t => {
          const d = daysTo(t.expires_at)
          const expiring = d !== null && d <= 15
          return (
            <div key={t.id} className="card hover">
              <div className="between mb-16">
                <div style={{ fontSize: 16, fontWeight: 800 }}>{toolLabel(t.tool)}</div>
                <Badge kind={t.connected ? 'active' : 'draft'}>
                  <i className="dot" /> {t.connected ? 'Conectado' : 'Sin conectar'}
                </Badge>
              </div>

              <div className="grid g-3" style={{ gap: 10 }}>
                <div><div className="muted-3 fz-12">Plan</div><div className="bold">{t.plan || '—'}</div></div>
                <div><div className="muted-3 fz-12">Costo/mes</div><div className="bold">{t.cost_month ? `$${t.cost_month}` : '—'}</div></div>
                <div><div className="muted-3 fz-12">Vence</div><div className="bold">{t.expires_at || '—'}</div></div>
              </div>

              {expiring && (
                <div className="mt-16" style={{ color: 'var(--danger)', fontSize: 12, fontWeight: 600 }}>
                  ⚠ Vence en {d} día{d === 1 ? '' : 's'}
                </div>
              )}

              {t.notes && <div className="muted-3 fz-12 mt-16">{t.notes}</div>}

              <div className="mt-16">
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(t)}>Editar</button>
              </div>
            </div>
          )
        })}
      </div>

      {editing && (
        <Modal title={toolLabel(editing.tool)} onClose={() => setEditing(null)}>
          <SystemStatusForm tool={editing} onSave={saveEdit} />
        </Modal>
      )}
    </>
  )
}

function SystemStatusForm({ tool, onSave }) {
  const [connected, setConnected] = useState(tool.connected)
  const [plan, setPlan] = useState(tool.plan || '')
  const [costMonth, setCostMonth] = useState(tool.cost_month ?? '')
  const [expiresAt, setExpiresAt] = useState(tool.expires_at || '')
  const [notes, setNotes] = useState(tool.notes || '')

  const submit = (e) => {
    e.preventDefault()
    onSave({
      connected,
      plan: plan || null,
      cost_month: costMonth === '' ? null : Number(costMonth),
      expires_at: expiresAt || null,
      notes: notes || null,
    })
  }

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label>Estado</label>
        <button type="button" className={`btn btn-sm ${connected ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setConnected(c => !c)}>
          {connected ? 'Conectado' : 'Sin conectar'}
        </button>
      </div>
      <div className="field">
        <label>Plan</label>
        <input className="input" value={plan} onChange={e => setPlan(e.target.value)} placeholder="free, pago x uso, self-host..." />
      </div>
      <div className="field">
        <label>Costo mensual (USD)</label>
        <input className="input" type="number" step="0.01" value={costMonth} onChange={e => setCostMonth(e.target.value)} />
      </div>
      <div className="field">
        <label>Vencimiento</label>
        <input className="input" type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
      </div>
      <div className="field">
        <label>Notas</label>
        <input className="input" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <button className="btn btn-primary btn-block" type="submit">Guardar</button>
    </form>
  )
}
