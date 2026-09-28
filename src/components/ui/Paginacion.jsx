import { ChevronLeft, ChevronRight } from 'lucide-react'

// pagina empieza en 0 (asi la maneja el backend), al usuario se le muestra desde 1
export default function Paginacion({ pagina, totalPaginas, totalElementos, alCambiar }) {
  if (totalPaginas <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-2 pt-4 text-sm text-suave">
      <span>{totalElementos} en total</span>
      <div className="flex items-center gap-2">
        <button className="btn-secundario px-2" disabled={pagina === 0} onClick={() => alCambiar(pagina - 1)} aria-label="Anterior">
          <ChevronLeft size={16} />
        </button>
        <span>
          {pagina + 1} de {totalPaginas}
        </span>
        <button
          className="btn-secundario px-2"
          disabled={pagina + 1 >= totalPaginas}
          onClick={() => alCambiar(pagina + 1)}
          aria-label="Siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
