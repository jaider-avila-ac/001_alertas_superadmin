// marco de cada grafico: titulo, una linea que dice que muestra y el grafico
export default function TarjetaGrafico({ titulo, descripcion, children, className }) {
  return (
    <section className={'tarjeta break-inside-avoid ' + (className || '')}>
      <h2 className="font-semibold">{titulo}</h2>
      {descripcion && <p className="mt-0.5 text-xs text-suave">{descripcion}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}
