import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import Campo from '../../../components/ui/Campo'
import CampoContrasena from '../../../components/ui/CampoContrasena'
import FondoRosado from '../../../components/ui/FondoRosado'
import Mensaje from '../../../components/ui/Mensaje'

export default function LoginPage() {
  const { superadmin, entrar } = useAuth()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (superadmin) {
    return <Navigate to="/instituciones" replace />
  }

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await entrar(usuario.trim(), contrasena)
      navigate('/instituciones', { replace: true })
    } catch (err) {
      setError(err.message)
    }
    setEnviando(false)
  }

  return (
    <FondoRosado>
      <form onSubmit={enviar} className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-texto">Iniciar sesion</h1>
          <p className="mt-2 text-sm font-medium text-primario-600">Panel del superadmin</p>
        </div>

        <Mensaje tipo="error">{error}</Mensaje>

        <Campo
          id="usuario"
          etiqueta="Usuario"
          obligatorio
          autoComplete="username"
          placeholder="Ingresa tu usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <CampoContrasena
          id="contrasena"
          etiqueta="Contrasena"
          obligatorio
          placeholder="Ingresa tu contrasena"
          autoComplete="current-password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button
          type="submit"
          className="btn-primario mt-2 w-full py-4 text-lg font-bold shadow-lg"
          disabled={enviando}
        >
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </FondoRosado>
  )
}
