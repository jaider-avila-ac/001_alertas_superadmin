// etiqueta + input + ayuda. el resto de props va directo al input
// error: el problema del campo, sale en rojo en vez de la ayuda
export default function Campo({ etiqueta, ayuda, error, obligatorio, id, ...props }) {
  let clase = 'input'
  if (error) {
    clase = 'input border-peligro-600'
  }

  return (
    <div>
      <label htmlFor={id} className="etiqueta">
        {etiqueta}
        {obligatorio && <span className="text-peligro-600"> *</span>}
      </label>
      <input id={id} className={clase} required={obligatorio} aria-invalid={error ? true : undefined} {...props} />
      {error && <p className="mt-1 text-xs text-peligro-600">{error}</p>}
      {!error && ayuda && <p className="mt-1 text-xs text-suave">{ayuda}</p>}
    </div>
  )
}
