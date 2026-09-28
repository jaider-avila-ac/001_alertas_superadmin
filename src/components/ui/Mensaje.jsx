import { CircleAlert, CircleCheck } from 'lucide-react'

// tipo: 'error' o 'exito'
export default function Mensaje({ tipo, children }) {
  if (!children) {
    return null
  }

  if (tipo === 'exito') {
    return (
      <div className="flex items-start gap-2 bg-exito-50 px-3 py-2 text-sm text-exito-700">
        <CircleCheck size={18} className="mt-0.5 shrink-0" />
        <span>{children}</span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2 bg-peligro-50 px-3 py-2 text-sm text-peligro-700" role="alert">
      <CircleAlert size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
