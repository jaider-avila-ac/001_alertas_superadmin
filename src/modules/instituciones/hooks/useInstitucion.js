import { useCallback, useEffect, useState } from 'react'
import { buscarInstitucion, listarAdministradores } from '../../../services/institucionService'

// detalle de una institucion con sus administradores
export default function useInstitucion(slug) {
  const [institucion, setInstitucion] = useState(null)
  const [administradores, setAdministradores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const datos = await buscarInstitucion(slug)
      const admins = await listarAdministradores(slug)
      setInstitucion(datos)
      setAdministradores(admins)
    } catch (err) {
      setError(err.message)
    }
    setCargando(false)
  }, [slug])

  useEffect(() => {
    cargar()
  }, [cargar])

  // despues de una accion se reemplaza solo lo que cambio, sin volver a cargar todo
  function reemplazarAdministrador(actualizado) {
    const lista = []
    for (const admin of administradores) {
      if (admin.codigo === actualizado.codigo) {
        lista.push(actualizado)
      } else {
        lista.push(admin)
      }
    }
    setAdministradores(lista)
  }

  function agregarAdministrador(nuevo) {
    setAdministradores([...administradores, nuevo])
  }

  return {
    institucion: institucion,
    setInstitucion: setInstitucion,
    administradores: administradores,
    reemplazarAdministrador: reemplazarAdministrador,
    agregarAdministrador: agregarAdministrador,
    cargando: cargando,
    error: error,
    recargar: cargar,
  }
}
