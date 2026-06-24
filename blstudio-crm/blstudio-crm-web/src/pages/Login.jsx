import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { Logo, LogoMark } from '../components/ui.jsx'

export default function Login() {
  const { signIn, live } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const { error } = await signIn(email, password)
    if (error) setErr(error.message || 'No se pudo iniciar sesión')
    setBusy(false)
  }

  return (
    <div className="login-wrap">
      <div className="login-grid-bg" />
      <form className="login-card" onSubmit={submit}>
        <div className="center gap-12">
          <LogoMark s={36} />
          <Logo size={26} />
        </div>
        <h1>Panel de gestión</h1>
        <div className="sub">Contenido · ventas · clientes · campañas, en un solo lugar.</div>

        <div className="field">
          <label>Email</label>
          <input className="input" type="email" value={email} placeholder="vos@blstudio.com"
            onChange={e => setEmail(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input className="input" type="password" value={password} placeholder="••••••••"
            onChange={e => setPassword(e.target.value)} />
        </div>

        {err && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{err}</div>}

        <button className="btn btn-primary btn-block" disabled={busy} type="submit">
          {busy ? 'Entrando…' : 'Entrar'}
        </button>

        {!live && (
          <div className="muted-3 fz-12" style={{ marginTop: 16, textAlign: 'center' }}>
            Modo demo — entrá con cualquier dato para ver el panel.
          </div>
        )}
      </form>
    </div>
  )
}
