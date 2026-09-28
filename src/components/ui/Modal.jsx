import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ abierto, titulo, alCerrar, children }) {
  // cerrar con escape
  useEffect(() => {
    function tecla(e) {
      if (e.key === 'Escape') {
        alCerrar()
      }
    }
    if (abierto) {
      window.addEventListener('keydown', tecla)
    }
    return () => window.removeEventListener('keydown', tecla)
  }, [abierto, alCerrar])

  if (!abierto) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-texto/40 p-0 sm:items-center sm:p-4" onClick={alCerrar}>
      <div
        className="max-h-[90vh] w-full overflow-y-auto bg-superficie p-5 sm:max-w-lg"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <button className="p-1 text-suave hover:bg-fondo" onClick={alCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
