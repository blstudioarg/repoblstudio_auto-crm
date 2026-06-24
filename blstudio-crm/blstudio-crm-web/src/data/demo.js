// Datos de demostración — reflejan el seed.sql.
// Se usan cuando NO hay Supabase configurado, para ver el panel funcionando ya.
import { POSTS } from './posts.js'

export const DEMO = {
  posts: POSTS,

  prospects: [
    { id: 'pr1', name: 'Tcocina', city: 'Olavarría', rubro: 'Hamburguesería', stage: 'closed', ig_handle: '@tcocina', last_contact: '2026-06-10', notes: 'Cliente cerrado. 150 burgers/domingo.' },
    { id: 'pr2', name: 'Doña Clara', city: 'Olavarría', rubro: 'Rotisería', stage: 'closed', ig_handle: '@donaclara', last_contact: '2026-06-12', notes: 'Rotisería 20 años, todo manual. Cerrado.' },
    { id: 'pr3', name: 'Parrilla Vieja', city: 'Azul', rubro: 'Parrilla', stage: 'discovery', ig_handle: '@parrillavieja', last_contact: '2026-06-20', notes: 'Reunión de discovery agendada. Interesado en catálogo + SEO.' },
    { id: 'pr4', name: 'La Ventera', city: 'Tandil', rubro: 'Almacén / Aceite', stage: 'forge', ig_handle: '@laventera', last_contact: '2026-06-22', notes: 'Armando demo. SEO ya rankeando primero.' },
    { id: 'pr5', name: 'Burger Norte', city: 'Tandil', rubro: 'Hamburguesería', stage: 'reach', ig_handle: '@burgernorte', last_contact: '2026-06-23', notes: 'Primer contacto por DM. Pidió info.' },
    { id: 'pr6', name: 'El Buen Sabor', city: 'Olavarría', rubro: 'Rotisería', stage: 'scout', ig_handle: '@elbuensabor', last_contact: null, notes: 'Detectado. Sin web, sin Google Business.' },
  ],

  clients: [
    { id: 'cl1', name: 'Tcocina', city: 'Olavarría', rubro: 'Hamburguesería', domain: 'tcocina.com', setup_fee: 150, mrr: 35, currency: 'USD', start_date: '2026-04-01', renewal_date: '2026-08-01', health_score: 96, status: 'active', ig_handle: '@tcocina', tech_stack: { laravel: true, supabase: true, seo: true } },
    { id: 'cl2', name: 'Doña Clara', city: 'Olavarría', rubro: 'Rotisería', domain: 'donaclara.com.ar', setup_fee: 150, mrr: 35, currency: 'USD', start_date: '2026-05-15', renewal_date: '2026-07-15', health_score: 82, status: 'active', ig_handle: '@donaclara', tech_stack: { laravel: true, supabase: true, seo: false } },
  ],

  campaigns: [
    { id: 'ca1', name: 'CBO Julio — Gastronómicos Olavarría', type: 'CBO', objective: 'conversions', budget_daily: 12, budget_total: 360, start_date: '2026-07-01', end_date: '2026-07-31', status: 'active', spent: 84, reach: 18400, impressions: 42300, clicks: 612, dms: 47, leads: 11, cpl: 7.6, notes: 'Mejor anuncio: caso Tcocina.' },
    { id: 'ca2', name: 'Retargeting — Visitantes perfil', type: 'Retargeting', objective: 'traffic', budget_daily: 5, budget_total: 150, start_date: '2026-07-08', end_date: '2026-07-31', status: 'draft', spent: 0, reach: 0, impressions: 0, clicks: 0, dms: 0, leads: 0, cpl: null, notes: 'Arranca cuando haya pixel con data.' },
  ],

  next_actions: [
    { id: 'na1', text: 'Aprobar los 3 posts de la semana 1', tag: 'urgent', done: false, due_date: '2026-06-25' },
    { id: 'na2', text: 'Mandar propuesta a Parrilla Vieja', tag: 'urgent', done: false, due_date: '2026-06-26' },
    { id: 'na3', text: 'Terminar demo de La Ventera', tag: 'soon', done: false, due_date: '2026-06-28' },
    { id: 'na4', text: 'Renovación Doña Clara (vence 15/7)', tag: 'soon', done: false, due_date: '2026-07-10' },
    { id: 'na5', text: 'Generar imágenes IA del carrusel sem 2', tag: 'later', done: false, due_date: null },
    { id: 'na6', text: 'Conectar n8n con Meta API', tag: 'later', done: true, due_date: null },
  ],

  system_status: [
    { id: 's1', tool: 'nanobanana', connected: true, plan: 'pago x uso', cost_month: 12, notes: 'Generación de imágenes IA. Probada.' },
    { id: 's2', tool: 'supabase', connected: false, plan: 'free', cost_month: 0, notes: 'Pendiente de crear proyecto.' },
    { id: 's3', tool: 'n8n', connected: false, plan: 'self-host', cost_month: 0, notes: 'Workflows listos, falta instancia + tokens.' },
    { id: 's4', tool: 'meta_api', connected: false, plan: '—', cost_month: 0, notes: 'Requiere cuenta business + tokens.' },
    { id: 's5', tool: 'higgsfield', connected: false, plan: '—', cost_month: 0, notes: 'Video IA. Sin integrar.' },
    { id: 's6', tool: 'remotion', connected: false, plan: '—', cost_month: 0, notes: 'Render de video. Sin integrar.' },
    { id: 's7', tool: 'canva_mcp', connected: false, plan: '—', cost_month: 0, notes: 'Reemplazado por HTML (Carrusel Studio).' },
  ],
}
