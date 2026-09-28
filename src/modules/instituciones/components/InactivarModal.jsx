import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Mensaje from '../../../components/ui/Mensaje'

export default function InactivarModal({ abierto, nombre, alCerrar, alConfirmar }) {
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function cerrar() {
    setMotivo('')
    setError('')
    alCerrar()
  }

  async function confirmar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await alConfirmar(motivo.trim())
      setMotivo('')
    } catch (err) {
      setError(err.message)
    }
    setEnviando(false)
  }

  return (
    <Modal abierto={abierto} titulo="Inhabilitar institucion" alCerrar={cerrar}>
      <form onSubmit={confirmar} className="space-y-4">
        <p className="text-sm text-suave">
          Nadie de <strong className="text-texto">{nombre}</strong> podra entrar al sistema y las sesiones abiertas se
          cierran. Los datos no se borran: al habilitarla de nuevo todo queda como estaba.
        </p>

        <Mensaje tipo="error">{error}</Mensaje>

        <div>
          <label htmlFor="motivo" className="etiqueta">
            Motivo<span className="text-peligro-600"> *</span>
          </label>
          <textarea
            id="motivo"
            className="input min-h-24"
            required
            maxLength={300}
            placeholder="Ej: fin del contrato"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <p className="mt-1 text-right text-xs text-suave">{motivo.length}/300</p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secundario" onClick={cerrar}>
            Cancelar
          </button>
          <button type="submit" className="btn-peligro" disabled={enviando || motivo.trim() === ''}>
            {enviando ? 'Inhabilitando...' : 'Inhabilitar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
