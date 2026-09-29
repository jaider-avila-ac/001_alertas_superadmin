// tarjeta de color con el numero grande en blanco, como en el dashboard anterior
export default function Indicador({ titulo, valor, detalle, color, icono }) {
  const Icono = icono
  return (
    <div className="indicador break-inside-avoid p-4 text-white shadow-sm sm:p-5" style={{ backgroundColor: color }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/85">{titulo}</p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">{valor}</p>
          {detalle && <p className="mt-1 text-xs text-white/85">{detalle}</p>}
        </div>
        {Icono && <Icono size={30} className="shrink-0 text-white/70" />}
      </div>
    </div>
  )
}
