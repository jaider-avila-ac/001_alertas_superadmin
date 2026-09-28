import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import Cargando from '../../../components/ui/Cargando'
import Mensaje from '../../../components/ui/Mensaje'
import Paginacion from '../../../components/ui/Paginacion'
import Vacio from '../../../components/ui/Vacio'
import InstitucionesLista from '../components/InstitucionesLista'
import useInstituciones from '../hooks/useInstituciones'

const FILTROS = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'si', texto: 'Habilitadas' },
  { valor: 'no', texto: 'Inhabilitadas' },
]

export default function InstitucionesPage() {
  const lista = useInstituciones()

  let contenido
  if (lista.cargando && !lista.datos) {
    contenido = <Cargando texto="Cargando instituciones..." />
  } else if (lista.error) {
    contenido = <Mensaje tipo="error">{lista.error}</Mensaje>
  } else if (lista.datos.contenido.length === 0) {
    let texto = 'Todavia no hay instituciones'
    if (lista.texto || lista.activa !== 'todas') {
      texto = 'No hay instituciones con esos filtros'
    }
    contenido = <Vacio texto={texto} />
  } else {
    contenido = (
      <>
        <InstitucionesLista instituciones={lista.datos.contenido} />
        <Paginacion
          pagina={lista.datos.pagina}
          totalPaginas={lista.datos.totalPaginas}
          totalElementos={lista.datos.totalElementos}
          alCambiar={lista.setPagina}
        />
      </>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Instituciones</h1>
        <Link to="/instituciones/nueva" className="btn-primario">
          <Plus size={16} />
          Nueva institucion
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-suave" size={16} />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre o enlace"
            value={lista.texto}
            onChange={(e) => lista.setTexto(e.target.value)}
            aria-label="Buscar"
          />
        </div>
        <select
          className="input sm:w-48"
          value={lista.activa}
          onChange={(e) => lista.cambiarActiva(e.target.value)}
          aria-label="Filtrar por estado"
        >
          {FILTROS.map((filtro) => (
            <option key={filtro.valor} value={filtro.valor}>
              {filtro.texto}
            </option>
          ))}
        </select>
      </div>

      {contenido}
    </div>
  )
}
