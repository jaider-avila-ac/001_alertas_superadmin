import { useEffect, useState } from 'react'
import useDatos from '../../../lib/useDatos'
import { listarInstituciones } from '../../../services/institucionService'

const TAMANIO = 10

// listado con busqueda, filtro por estado y paginacion (todo en el backend).
// con cache: al volver se ve al instante y se revisa en segundo plano
export default function useInstituciones() {
  const [texto, setTexto] = useState('')
  const [textoBuscado, setTextoBuscado] = useState('')
  const [activa, setActiva] = useState('todas')
  const [pagina, setPagina] = useState(0)

  // espera a que el usuario deje de escribir para no consultar por cada letra
  useEffect(() => {
    const espera = setTimeout(() => {
      setTextoBuscado(texto.trim())
      setPagina(0)
    }, 350)
    return () => clearTimeout(espera)
  }, [texto])

  const filtros = { texto: textoBuscado, activa: activa, pagina: pagina, tamanio: TAMANIO }
  const consulta = useDatos(['instituciones', filtros], function () {
    return listarInstituciones(filtros)
  })

  function cambiarActiva(valor) {
    setActiva(valor)
    setPagina(0)
  }

  let datos = null
  if (consulta.datos) {
    datos = consulta.datos
  }

  return {
    texto: texto,
    setTexto: setTexto,
    activa: activa,
    cambiarActiva: cambiarActiva,
    pagina: pagina,
    setPagina: setPagina,
    datos: datos,
    cargando: consulta.cargando,
    error: consulta.error,
  }
}
