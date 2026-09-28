import { useEffect, useState } from 'react'
import { listarInstituciones } from '../../../services/institucionService'

const TAMANIO = 10

// listado con busqueda, filtro por estado y paginacion (todo en el backend)
export default function useInstituciones() {
  const [texto, setTexto] = useState('')
  const [textoBuscado, setTextoBuscado] = useState('')
  const [activa, setActiva] = useState('todas')
  const [pagina, setPagina] = useState(0)

  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // espera a que el usuario deje de escribir para no consultar por cada letra
  useEffect(() => {
    const espera = setTimeout(() => {
      setTextoBuscado(texto.trim())
      setPagina(0)
    }, 350)
    return () => clearTimeout(espera)
  }, [texto])

  useEffect(() => {
    let vigente = true

    async function cargar() {
      setCargando(true)
      setError('')
      try {
        const respuesta = await listarInstituciones({
          texto: textoBuscado,
          activa: activa,
          pagina: pagina,
          tamanio: TAMANIO,
        })
        if (vigente) {
          setDatos(respuesta)
        }
      } catch (err) {
        if (vigente) {
          setError(err.message)
        }
      }
      if (vigente) {
        setCargando(false)
      }
    }

    cargar()

    // si cambian los filtros antes de que llegue la respuesta, se ignora la vieja
    return () => {
      vigente = false
    }
  }, [textoBuscado, activa, pagina])

  function cambiarActiva(valor) {
    setActiva(valor)
    setPagina(0)
  }

  return {
    texto: texto,
    setTexto: setTexto,
    activa: activa,
    cambiarActiva: cambiarActiva,
    pagina: pagina,
    setPagina: setPagina,
    datos: datos,
    cargando: cargando,
    error: error,
  }
}
