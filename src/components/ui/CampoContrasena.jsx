import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// input de contrasena con el ojito para verla
export default function CampoContrasena({ etiqueta, ayuda, obligatorio, id, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="etiqueta">
        {etiqueta}
        {obligatorio && <span className="text-peligro-600"> *</span>}
      </label>
      <div className="relative">
        <input id={id} type={visible ? 'text' : 'password'} className="input pr-12" required={obligatorio} {...props} />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-suave hover:text-primario-500"
          aria-label={visible ? 'Ocultar contrasena' : 'Ver contrasena'}
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {ayuda && <p className="mt-1 text-xs text-suave">{ayuda}</p>}
    </div>
  )
}
