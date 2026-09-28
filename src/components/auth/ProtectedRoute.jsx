import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Cargando from '../ui/Cargando'

// solo deja pasar si hay sesion de superadmin. el backend igual valida el rol en cada solicitud
export default function ProtectedRoute() {
  const { superadmin, cargando } = useAuth()

  if (cargando) {
    return <Cargando texto="Revisando sesion..." />
  }

  if (!superadmin) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
