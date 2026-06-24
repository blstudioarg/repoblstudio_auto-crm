import React, { useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import { DataProvider } from './lib/data.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Cockpit from './pages/Cockpit.jsx'
import Contenido from './pages/Contenido.jsx'
import CRM from './pages/CRM.jsx'
import Clientes from './pages/Clientes.jsx'
import Campanas from './pages/Campanas.jsx'
import Sistema from './pages/Sistema.jsx'

const PAGES = { cockpit: Cockpit, contenido: Contenido, crm: CRM, clientes: Clientes, campanas: Campanas, sistema: Sistema }

function Shell() {
  const { user, ready } = useAuth()
  const [page, setPage] = useState('cockpit')
  if (!ready) return null
  if (!user) return <Login />
  const Page = PAGES[page]
  return (
    <DataProvider>
      <Layout page={page} setPage={setPage}>
        <Page setPage={setPage} />
      </Layout>
    </DataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
