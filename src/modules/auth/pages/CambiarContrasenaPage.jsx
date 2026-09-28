import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { cambiarContrasena } from '../../../services/authService'
import CampoContrasena from '../../../components/ui/CampoContrasena'
import Mensaje from '../../../components/ui/Mensaje'

export default function CambiarContrasenaPage() {
  const { renovarToken } = useAuth()

  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [repetir, setRepetir] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setExito('')

    if (nueva !== repetir) {
      setError('La contrasena nueva y la confirmacion no coinciden')
      return
    }

    setEnviando(true)
    try {
      const respuesta = await cambiarContrasena(actual, nueva)
      renovarToken(respuesta.token)
      setActual('')
      setNueva('')
      setRepetir('')
      setExito('Contrasena actualizada. Se cerro la sesion en los otros equipos.')
    } catch (err) {
      setError(err.message)
    }
    setEnviando(false)
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-semibold">Cambiar contrasena</h1>

      <form onSubmit={enviar} className="tarjeta space-y-4">
        <Mensaje tipo="error">{error}</Mensaje>
        <Mensaje tipo="exito">{exito}</Mensaje>

        <CampoContrasena
          id="actual"
          etiqueta="Contrasena actual"
          obligatorio
          autoComplete="current-password"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
        />
        <CampoContrasena
          id="nueva"
          etiqueta="Contrasena nueva"
          obligatorio
          minLength={8}
          autoComplete="new-password"
          ayuda="Minimo 8 caracteres"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />
        <CampoContrasena
          id="repetir"
          etiqueta="Repite la contrasena nueva"
          obligatorio
          autoComplete="new-password"
          value={repetir}
          onChange={(e) => setRepetir(e.target.value)}
        />

        <button type="submit" className="btn-primario w-full" disabled={enviando}>
          <KeyRound size={16} />
          {enviando ? 'Guardando...' : 'Cambiar contrasena'}
        </button>
      </form>
    </div>
  )
}
