import { useEffect, useRef, useState } from 'react'
import { abrirConexionSesiones } from '../../../services/sesionService'

const PING_CADA = 25000
const ESPERA_MAXIMA = 30000

// escucha los cambios de sesiones por websocket. alRecibir(evento) con cada cambio;
// alReconectar() cuando la conexion vuelve despues de caerse (pudo perderse algo).
// si se cae se reconecta sola, esperando cada vez un poco mas
export default function useSesionesEnVivo(alRecibir, alReconectar) {
  const [conectado, setConectado] = useState(false)

  // siempre la ultima version de las funciones, sin volver a abrir la conexion
  const recibir = useRef(alRecibir)
  const reconectar = useRef(alReconectar)
  recibir.current = alRecibir
  reconectar.current = alReconectar

  useEffect(() => {
    let activa = true
    let socket = null
    let ping = null
    let reintento = null
    let espera = 2000
    let yaAbrio = false

    async function conectar() {
      if (!activa) {
        return
      }
      let nuevo
      try {
        nuevo = await abrirConexionSesiones()
      } catch (e) {
        programarReintento()
        return
      }
      if (!activa) {
        nuevo.close()
        return
      }
      socket = nuevo

      socket.onopen = () => {
        espera = 2000
        setConectado(true)
        if (yaAbrio) {
          reconectar.current()
        }
        yaAbrio = true
        ping = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send('ping')
          }
        }, PING_CADA)
      }

      socket.onmessage = (mensaje) => {
        recibir.current(JSON.parse(mensaje.data))
      }

      socket.onclose = () => {
        clearInterval(ping)
        setConectado(false)
        programarReintento()
      }
    }

    function programarReintento() {
      if (!activa) {
        return
      }
      clearTimeout(reintento)
      reintento = setTimeout(conectar, espera)
      espera = Math.min(espera * 2, ESPERA_MAXIMA)
    }

    conectar()

    return () => {
      activa = false
      clearTimeout(reintento)
      clearInterval(ping)
      if (socket) {
        socket.onclose = null
        socket.close()
      }
    }
  }, [])

  return conectado
}
