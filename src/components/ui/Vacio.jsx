import { Inbox } from 'lucide-react'

export default function Vacio({ texto, children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-suave">
      <Inbox size={28} />
      <p>{texto}</p>
      {children}
    </div>
  )
}
