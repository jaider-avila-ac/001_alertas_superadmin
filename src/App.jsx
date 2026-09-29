import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import { CambiarContrasenaPage, LoginPage } from './modules/auth'
import { EstadisticasPage } from './modules/estadisticas'
import { CrearInstitucionPage, InstitucionDetallePage, InstitucionesPage } from './modules/instituciones'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/instituciones" element={<InstitucionesPage />} />
          <Route path="/nueva-institucion" element={<CrearInstitucionPage />} />
          <Route path="/instituciones/:slug" element={<InstitucionDetallePage />} />
          <Route path="/estadisticas" element={<EstadisticasPage />} />
          <Route path="/contrasena" element={<CambiarContrasenaPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/instituciones" replace />} />
    </Routes>
  )
}
