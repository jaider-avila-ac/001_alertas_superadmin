// tipo: 'exito', 'peligro', 'aviso' o 'neutro'
const CLASES = {
  exito: 'bg-exito-50 text-exito-700',
  peligro: 'bg-peligro-50 text-peligro-700',
  aviso: 'bg-aviso-50 text-aviso-700',
  neutro: 'bg-fondo text-suave',
}

export default function Insignia({ tipo, children }) {
  const clase = CLASES[tipo] || CLASES.neutro
  return <span className={'inline-flex px-2.5 py-0.5 text-xs font-medium ' + clase}>{children}</span>
}
