import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Building2, KeyRound, LogOut, Menu, PanelLeft, PanelLeftClose } from 'lucide-react'
import logoBlanco from '../../assets/logo-blanco.png'
import { useAuth } from '../../context/AuthContext'

const OPCIONES = [
  { ruta: '/instituciones', texto: 'Instituciones', icono: Building2 },
  { ruta: '/contrasena', texto: 'Cambiar contrasena', icono: KeyRound },
]

function esEscritorio() {
  return window.innerWidth >= 1024
}

function tituloDe(ruta) {
  if (ruta === '/nueva-institucion') {
    return 'Nueva institucion'
  }
  if (ruta.startsWith('/instituciones/')) {
    return 'Detalle de la institucion'
  }
  for (const opcion of OPCIONES) {
    if (opcion.ruta === ruta) {
      return opcion.texto
    }
  }
  return 'Superadmin'
}

export default function Layout() {
  const { superadmin, salir } = useAuth()
  const location = useLocation()
  const [abierto, setAbierto] = useState(esEscritorio())

  function alNavegar() {
    if (!esEscritorio()) {
      setAbierto(false)
    }
  }

  function claseEnlace({ isActive }) {
    const base = 'mb-0.5 flex items-center gap-3 whitespace-nowrap px-3 py-2.5 text-sm transition-colors '
    if (isActive) {
      return base + 'bg-superficie font-semibold text-primario-500'
    }
    return base + 'text-white hover:bg-primario-600'
  }

  let claseBarra = 'w-64 -translate-x-full lg:w-16 lg:translate-x-0'
  if (abierto) {
    claseBarra = 'w-64 translate-x-0'
  }

  const inicial = superadmin.nombres ? superadmin.nombres.charAt(0).toUpperCase() : 'S'

  return (
    <div className="flex h-screen overflow-hidden bg-fondo">
      <aside
        className={
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-primario-500 transition-all duration-300 ' +
          'lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:shrink-0 ' +
          claseBarra
        }
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-primario-400 px-4">
          {abierto && <img src={logoBlanco} alt="Alertas" className="h-8 w-auto" />}
          <button
            onClick={() => setAbierto(!abierto)}
            className="ml-auto hidden p-1.5 text-white/70 transition-colors hover:bg-primario-600 hover:text-white lg:flex"
            title={abierto ? 'Contraer menu' : 'Expandir menu'}
          >
            {abierto ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          </button>
        </div>

        {abierto && (
          <p className="border-b border-primario-400 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/90">
            Panel del superadmin
          </p>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {OPCIONES.map((opcion) => {
            const Icono = opcion.icono
            return (
              <NavLink key={opcion.ruta} to={opcion.ruta} className={claseEnlace} onClick={alNavegar} title={opcion.texto}>
                <Icono size={17} className="shrink-0" />
                {abierto && <span>{opcion.texto}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-primario-400 px-2 py-3">
          <button
            onClick={salir}
            className="flex w-full items-center gap-3 whitespace-nowrap px-3 py-2.5 text-sm text-white transition-colors hover:bg-primario-600"
          >
            <LogOut size={17} className="shrink-0" />
            {abierto && <span>Cerrar sesion</span>}
          </button>
        </div>
      </aside>

      {abierto && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setAbierto(false)} />}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-borde bg-superficie px-3 md:h-16 md:px-6">
          <button
            onClick={() => setAbierto(!abierto)}
            className="p-1.5 text-suave transition-colors hover:bg-fondo lg:hidden"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>

          <span className="truncate text-base font-bold text-texto md:text-lg">{tituloDe(location.pathname)}</span>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primario-100 text-sm font-bold text-primario-600">
                {inicial}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold text-texto">{superadmin.nombres}</p>
                <p className="text-xs text-suave">Superadmin</p>
              </div>
            </div>

            <button
              onClick={salir}
              title="Cerrar sesion"
              className="flex items-center gap-1.5 text-sm font-medium text-peligro-500 transition-colors hover:text-peligro-600"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
