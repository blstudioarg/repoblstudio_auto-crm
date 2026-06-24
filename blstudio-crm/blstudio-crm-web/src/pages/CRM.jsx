import React, { useState } from 'react'
import { useData } from '../lib/data.jsx'
import { Modal, Badge, Icons } from '../components/ui.jsx'

const STAGES = [
  { id: 'scout', t: 'Scout', d: 'Detectado' },
  { id: 'forge', t: 'Forge', d: 'Demo en armado' },
  { id: 'reach', t: 'Reach', d: 'Contactado' },
  { id: 'discovery', t: 'Discovery', d: 'Reunión / propuesta' },
  { id: 'closed', t: 'Cerrado', d: 'Cliente' },
]

export default function CRM() {
  const { db, update, insert } = useData()
  const { prospects } = db
  const [open, setOpen] = useState(null)
  const [drag, setDrag] = useState(null)
  const [over, setOver] = useState(null)
  const [adding, setAdding] = useState(false)

  const move = (id, stage) => update('prospects', id, { stage })

  return (
    <>
      <div className="between mb-16">
        <div className="muted fz-13">{prospects.filter(p => p.stage !== 'closed').length} prospectos abiertos · {prospects.filter(p => p.stage === 'closed').length} cerrados</div>
        <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}><Icons.plus /> Nuevo prospecto</button>
      </div>

      <div className="kanban">
        {STAGES.map(s => {
          const items = prospects.filter(p => p.stage === s.id)
          return (
            <div key={s.id}
              className="kcol"
              onDragOver={(e) => { e.preventDefault(); setOver(s.id) }}
              onDragLeave={() => setOver(null)}
              onDrop={() => { if (drag) move(drag, s.id); setDrag(null); setOver(null) }}
              style={over === s.id ? { borderColor: 'var(--accent)', background: 'rgba(168,255,62,0.04)' } : {}}>
              <div className="kcol-head">
                <div>
                  <div className="t">{s.t}</div>
                  <div className="muted-3 fz-12">{s.d}</div>
                </div>
                <span className="ct">{items.length}</span>
              </div>
              {items.map(p => (
                <div key={p.id} className="kcard" draggable
                  onDragStart={() => setDrag(p.id)} onDragEnd={() => setDrag(null)}
                  onClick={() => setOpen(p)}>
                  <div className="nm">{p.name}</div>
                  <div className="muted fz-12">{p.rubro} · {p.city}</div>
                  <div className="meta">
                    {p.ig_handle && <Badge kind="pilar">{p.ig_handle}</Badge>}
                    {p.last_contact && <span className="muted-3">{p.last_contact}</span>}
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="muted-3 fz-12" style={{ padding: 8 }}>—</div>}
            </div>
          )
        })}
      </div>

      {open && <ProspectModal p={open} onClose={() => setOpen(null)} update={update} />}
      {adding && <AddModal onClose={() => setAdding(false)} insert={insert} />}
    </>
  )
}

function ProspectModal({ p, onClose, update }) {
  const [notes, setNotes] = useState(p.notes || '')
  return (
    <Modal title={p.name} onClose={onClose}>
      <div className="flex gap-8 mb-16" style={{ flexWrap: 'wrap' }}>
        <Badge kind="arc">{p.stage}</Badge>
        <Badge kind="pilar">{p.rubro}</Badge>
        <Badge kind="pilar">{p.city}</Badge>
        {p.ig_handle && <Badge kind="pilar">{p.ig_handle}</Badge>}
      </div>
      <div className="field">
        <label>Etapa</label>
        <select className="input" value={p.stage} onChange={e => update('prospects', p.id, { stage: e.target.value })}>
          {STAGES.map(s => <option key={s.id} value={s.id}>{s.t} — {s.d}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Notas</label>
        <textarea className="input" rows={4} value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => update('prospects', p.id, { notes })} />
      </div>
      <div className="right mt-16"><button className="btn btn-ghost btn-sm" onClick={onClose}>Cerrar</button></div>
    </Modal>
  )
}

function AddModal({ onClose, insert }) {
  const [f, setF] = useState({ name: '', rubro: '', city: 'Argentina', ig_handle: '', stage: 'scout', notes: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = () => { if (!f.name.trim()) return; insert('prospects', f); onClose() }
  return (
    <Modal title="Nuevo prospecto" onClose={onClose}>
      <div className="field"><label>Nombre</label><input className="input" value={f.name} onChange={set('name')} autoFocus /></div>
      <div className="grid g-2">
        <div className="field"><label>Rubro</label><input className="input" value={f.rubro} onChange={set('rubro')} placeholder="Hamburguesería" /></div>
        <div className="field"><label>Ciudad</label><input className="input" value={f.city} onChange={set('city')} /></div>
      </div>
      <div className="grid g-2">
        <div className="field"><label>Instagram</label><input className="input" value={f.ig_handle} onChange={set('ig_handle')} placeholder="@cuenta" /></div>
        <div className="field"><label>Etapa</label>
          <select className="input" value={f.stage} onChange={set('stage')}>{STAGES.map(s => <option key={s.id} value={s.id}>{s.t}</option>)}</select>
        </div>
      </div>
      <div className="field"><label>Notas</label><textarea className="input" rows={3} value={f.notes} onChange={set('notes')} /></div>
      <div className="right"><button className="btn btn-primary btn-sm" onClick={save}><Icons.plus /> Agregar</button></div>
    </Modal>
  )
}
