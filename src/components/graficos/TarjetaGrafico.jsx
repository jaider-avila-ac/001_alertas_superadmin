// marco de cada grafico: titulo, una linea que dice que muestra y el grafico.
// min-w-0: sin esto el canvas no deja encoger la tarjeta al girar el celular y se sale de la pantalla
export default function TarjetaGrafico({ titulo, descripcion, children, className }) {
  return (
    <section className={'tarjeta min-w-0 break-inside-avoid ' + (className || '')}>
      <h2 className="font-semibold">{titulo}</h2>
      {descripcion && <p className="mt-0.5 text-xs text-suave">{descripcion}</p>}
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  )
}
