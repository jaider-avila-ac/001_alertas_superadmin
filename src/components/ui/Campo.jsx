// etiqueta + input + ayuda. el resto de props va directo al input
export default function Campo({ etiqueta, ayuda, obligatorio, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="etiqueta">
        {etiqueta}
        {obligatorio && <span className="text-peligro-600"> *</span>}
      </label>
      <input id={id} className="input" required={obligatorio} {...props} />
      {ayuda && <p className="mt-1 text-xs text-suave">{ayuda}</p>}
    </div>
  )
}
