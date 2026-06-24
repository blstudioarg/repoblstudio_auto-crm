import React from 'react'

/* ---------- Logo BLStudio ---------- */
export function Logo({ size = 22 }) {
  return (
    <span className="logo" style={{ fontSize: size }} aria-label="BLStudio">
      <span className="logo-word" style={{ fontSize: size }}>
        blstudio<span className="logo-dot">.</span>
      </span>
    </span>
  )
}
export function LogoMark({ s = 30 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#0f0f0f" stroke="#242424" />
      <circle cx="9" cy="10" r="1.6" fill="#a8ff3e" />
      <circle cx="16" cy="7" r="1.6" fill="#444" />
      <circle cx="23" cy="10" r="1.6" fill="#444" />
      <path d="M9 10 L16 7 L23 10" stroke="#2a2a2a" strokeWidth="1" />
      <text x="16" y="24" textAnchor="middle" fontFamily="Inter" fontWeight="900" fontSize="11" fill="#fff">bl</text>
    </svg>
  )
}

/* ---------- Iconos (línea, 18px) ---------- */
const I = (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p} />
export const Icons = {
  cockpit: () => <I><path d="M3 12l2-2 4 4 5-6 7 7" /><path d="M3 20h18" /></I>,
  content: () => <I><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></I>,
  crm: () => <I><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="10" y="4" width="5" height="11" rx="1" /><rect x="17" y="4" width="4" height="7" rx="1" /></I>,
  clients: () => <I><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6" /></I>,
  campaigns: () => <I><path d="M3 11l16-7v16L3 13z" /><path d="M7 12v5l3 1" /></I>,
  system: () => <I><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 9h6v6H9z" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" /></I>,
  logout: () => <I><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></I>,
  plus: () => <I><path d="M12 5v14M5 12h14" /></I>,
  check: () => <I><path d="M20 6 9 17l-5-5" /></I>,
  bolt: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>,
}

/* ---------- Badge ---------- */
export function Badge({ kind, children, className = '' }) {
  return <span className={`badge b-${kind} ${className}`}>{children}</span>
}

const STATUS_LABEL = {
  draft: 'Borrador', copy_ready: 'Copy listo', image_ready: 'Imagen lista',
  approved: 'Aprobado', scheduled: 'Programado', published: 'Publicado',
}
export const statusLabel = (s) => STATUS_LABEL[s] || s
export function StatusBadge({ status }) {
  return <Badge kind={status}><i className="dot" /> {statusLabel(status)}</Badge>
}

/* ---------- StatCard ---------- */
export function StatCard({ label, value, unit, delta, deltaUp, icon }) {
  return (
    <div className="card stat hover">
      {icon && <div className="ico-badge">{icon}</div>}
      <div className="label">{label}</div>
      <div className="value">{value}{unit && <small> {unit}</small>}</div>
      {delta && <div className={`delta ${deltaUp ? 'up' : ''}`}>{delta}</div>}
    </div>
  )
}

/* ---------- Progress / Ring ---------- */
export const Progress = ({ value }) => (
  <div className="progress"><i style={{ width: `${Math.min(100, value)}%` }} /></div>
)
export function Ring({ value }) {
  return <div className="ring" style={{ '--p': value }}><span>{value}</span></div>
}

/* ---------- Modal ---------- */
export function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose}>×</button>
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  )
}
