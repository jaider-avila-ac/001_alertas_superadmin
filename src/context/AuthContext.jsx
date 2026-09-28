import { createContext, useContext, useEffect, useState } from 'react'
import { borrarToken, guardarToken, leerToken } from '../services/api'
import { iniciarSesion, obtenerYo } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [superadmin, setSuperadmin] = useState(null)
  const [cargando, setCargando] = useState(true)

  // al abrir la app, si hay token se confirma con el backend que siga sirviendo
  useEffect(() => {
    async function revisarSesion() {
      if (!leerToken()) {
        setCargando(false)
        return
      }
      try {
        const datos = await obtenerYo()
        setSuperadmin(datos)
      } catch (e) {
        borrarToken()
      }
      setCargando(false)
    }
    revisarSesion()
  }, [])

  // api.js lanza este evento cuando el backend responde 401
  useEffect(() => {
    function alVencer() {
      setSuperadmin(null)
    }
    window.addEventListener('sesion-vencida', alVencer)
    return () => window.removeEventListener('sesion-vencida', alVencer)
  }, [])

  async function entrar(usuario, contrasena) {
    const respuesta = await iniciarSesion(usuario, contrasena)
    guardarToken(respuesta.token)
    setSuperadmin(respuesta.superadmin)
  }

  // despues de cambiar la contrasena el backend entrega un token nuevo
  function renovarToken(token) {
    guardarToken(token)
  }

  function salir() {
    borrarToken()
    setSuperadmin(null)
  }

  const valor = {
    superadmin: superadmin,
    cargando: cargando,
    entrar: entrar,
    salir: salir,
    renovarToken: renovarToken,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
