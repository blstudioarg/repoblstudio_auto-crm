import React, { useState, useMemo } from 'react'
import { useData } from '../lib/data.jsx'
import { StatusBadge, Badge, Modal, Icons, statusLabel } from '../components/ui.jsx'

const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const ARC_LABEL = { problema: 'El problema', realidad: 'La realidad', solucion: 'La solución', prueba: 'La prueba + cierre' }
const FLOW = ['draft', 'copy_ready', 'image_ready', 'approved', 'scheduled', 'published']
const HASHTAGS = ['#gastronomiaargentina', '#hamburgueseria', '#seolocal', '#pedidosonline', '#blstudio']

// índice de día de semana (lunes=0) para una fecha YYYY-MM-DD
const mondayIndex = (iso) => (new Date(iso + 'T12:00:00').getDay() + 6) % 7

export default function Contenido() {
  const { db, update, live } = useData()
  const posts = useMemo(() => [...db.posts].sort((a, b) => a.dia_narrativo - b.dia_narrativo), [db.posts])
  const [week, setWeek] = useState(0) // 0 = mes completo
  const [open, setOpen] = useState(null)
  const [view, setView] = useState('cal')

  const filtered = week === 0 ? posts : posts.filter(p => p.semana === week)

  // construir grilla mensual (julio 2026) con huecos iniciales
  const firstIso = posts[0]?.date || '2026-07-01'
  const lead = mondayIndex(firstIso)
  const cells = week === 0 ? [...Array(lead).fill(null), ...posts] : null

  const counts = FLOW.reduce((m, s) => (m[s] = posts.filter(p => p.status === s).length, m), {})

  return (
    <>
      {/* Resumen de producción */}
      <div className="grid g-4 mb-24" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
        {FLOW.map(s => (
          <div className="card" key={s} style={{ padding: 14 }}>
            <div className="value" style={{ fontSize: 26, fontWeight: 900 }}>{counts[s]}</div>
            <div className="muted fz-12" style={{ marginTop: 4 }}>{statusLabel(s)}</div>
          </div>
        ))}
      </div>

      <div className="between mb-16">
        <div className="week-tabs" style={{ margin: 0 }}>
          <button className={`week-tab ${week === 0 ? 'active' : ''}`} onClick={() => setWeek(0)}>Mes</button>
          {[1, 2, 3, 4].map(w => (
            <button key={w} className={`week-tab ${week === w ? 'active' : ''}`} onClick={() => setWeek(w)}>
              Sem {w} · {ARC_LABEL[posts.find(p => p.semana === w)?.arc]}
            </button>
          ))}
        </div>
        <div className="flex gap-8">
          <button className={`btn btn-ghost btn-sm ${view === 'cal' ? '' : ''}`} onClick={() => setView('cal')} style={view === 'cal' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>Calendario</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setView('list')} style={view === 'list' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>Lista</button>
        </div>
      </div>

      {/* Vista calendario */}
      {view === 'cal' && week === 0 && (
        <div className="card">
          <div className="cal" style={{ marginBottom: 8 }}>
            {DOW.map(d => <div className="cal-h" key={d}>{d}</div>)}
          </div>
          <div className="cal">
            {cells.map((p, i) => p === null
              ? <div className="cal-cell empty" key={'e' + i} />
              : (
                <div className="cal-cell" key={p.id} onClick={() => setOpen(p)}>
                  <div className="d"><span>{p.date.slice(8)}/7</span><i className="dot" style={{ background: dotColor(p.status) }} /></div>
                  <div className="tp">{p.topic}</div>
                  <span className={`fmt-tag fmt-${p.format}`}>{p.format}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Vista lista (o semana) */}
      {(view === 'list' || week !== 0) && (
        <div className="card">
          <div className="row-list">
            {filtered.map(p => (
              <div key={p.id} className="lrow" style={{ gridTemplateColumns: '40px 1fr auto auto', cursor: 'pointer' }} onClick={() => setOpen(p)}>
                <div className="accent bold">D{p.dia_narrativo}</div>
                <div>
                  <div className="nm">{p.topic}</div>
                  <div className="mut">{p.hook.slice(0, 70)}…</div>
                </div>
                <span className={`fmt-tag fmt-${p.format}`}>{p.format}</span>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {open && <PostModal post={open} onClose={() => setOpen(null)} update={update} live={live} />}
    </>
  )
}

function dotColor(s) {
  return { draft: '#555', copy_ready: '#8ab4ff', image_ready: '#c79bff', approved: '#a8ff3e', scheduled: '#ffcf5c', published: '#7dffa8' }[s] || '#555'
}

function PostModal({ post, onClose, update, live }) {
  const next = FLOW[Math.min(FLOW.indexOf(post.status) + 1, FLOW.length - 1)]
  return (
    <Modal title={`Día ${post.dia_narrativo} · ${post.topic}`} onClose={onClose}>
      <div className="flex gap-8 mb-16" style={{ flexWrap: 'wrap' }}>
        <StatusBadge status={post.status} />
        <span className={`fmt-tag fmt-${post.format}`}>{post.format}</span>
        <Badge kind="arc">{ARC_LABEL[post.arc]}</Badge>
        <Badge kind="pilar">Pilar {post.pilar}</Badge>
        <Badge kind="arc">{post.date}</Badge>
      </div>

      <div className="muted-3 fz-12" style={{ textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Hook</div>
      <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.35, marginBottom: 18 }}>“{post.hook}”</div>

      <div className="muted-3 fz-12" style={{ textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Caption</div>
      <div className="muted fz-13" style={{ lineHeight: 1.5, marginBottom: 18 }}>
        {post.caption || <span className="muted-3">Sin caption todavía. Generala en una sesión de Cowork con el prompt del hilo narrativo.</span>}
      </div>

      <div className="muted-3 fz-12" style={{ textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Hashtags sugeridos</div>
      <div className="pill-row mb-24">
        {HASHTAGS.map(h => <Badge kind="pilar" key={h}>{h}</Badge>)}
      </div>

      <div className="hr" />
      <div className="between">
        <div className="muted fz-13">Mover a: <b className="accent">{statusLabel(next)}</b></div>
        <div className="flex gap-8">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cerrar</button>
          {post.status !== 'published' && (
            <button className="btn btn-primary btn-sm" onClick={() => { update('posts', post.id, { status: next }); onClose() }}>
              <Icons.check /> {post.status === 'approved' ? 'Programar' : post.status === 'scheduled' ? 'Marcar publicado' : 'Avanzar'}
            </button>
          )}
        </div>
      </div>
      {!live && <div className="muted-3 fz-12 mt-16">Modo demo: los cambios no se guardan. Conectá Supabase para persistir.</div>}
    </Modal>
  )
}
