import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function BotonCopiar({ texto }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (e) {
      // algunos navegadores bloquean el portapapeles fuera de https
      setCopiado(false)
    }
  }

  return (
    <button type="button" className="btn-secundario px-2 py-1" onClick={copiar} aria-label="Copiar">
      {copiado ? <Check size={16} /> : <Copy size={16} />}
      <span className="text-xs">{copiado ? 'Copiado' : 'Copiar'}</span>
    </button>
  )
}
