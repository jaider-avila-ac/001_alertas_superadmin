import { LoaderCircle } from 'lucide-react'

export default function Cargando({ texto }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-suave">
      <LoaderCircle className="animate-spin" size={18} />
      {texto || 'Cargando...'}
    </div>
  )
}
