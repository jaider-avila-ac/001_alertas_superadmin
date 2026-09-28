import logoColor from '../../assets/logo-color.svg'

// fondo degradado con la tarjeta blanca al centro: login y pantallas sin sesion
export default function FondoRosado({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primario-400 to-primario-600 p-4">
      <div className="w-full max-w-lg bg-superficie p-8 shadow-2xl sm:p-12">
        <div className="mb-8 flex justify-center">
          <img src={logoColor} alt="Alertas" className="h-12 sm:h-16" />
        </div>
        {children}
      </div>
    </div>
  )
}
