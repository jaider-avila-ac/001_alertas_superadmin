import Campo from '../../../components/ui/Campo'
import { generarSlug } from '../../../utils/texto'

export const INSTITUCION_VACIA = {
  nombre: '',
  slug: '',
  codigoDane: '',
  municipio: '',
  departamento: '',
  direccion: '',
  telefono: '',
  correo: '',
}

// valores: objeto con los campos de INSTITUCION_VACIA
// slugAutomatico: mientras sea true el enlace se arma solo a partir del nombre
export default function DatosInstitucionCampos({ valores, alCambiar, slugAutomatico, setSlugAutomatico, urlFront }) {
  function cambiar(campo, valor) {
    const nuevos = { ...valores, [campo]: valor }

    if (campo === 'nombre' && slugAutomatico) {
      nuevos.slug = generarSlug(valor)
    }

    alCambiar(nuevos)
  }

  function cambiarSlug(valor) {
    setSlugAutomatico(false)
    cambiar('slug', valor.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  let ayudaSlug = 'Minusculas, numeros y guiones. Asi entran al sistema los usuarios del colegio'
  if (urlFront && valores.slug) {
    ayudaSlug = 'Enlace: ' + urlFront + '/' + valores.slug
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Campo
          id="nombre"
          etiqueta="Nombre de la institucion"
          obligatorio
          maxLength={150}
          value={valores.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Campo
          id="slug"
          etiqueta="Enlace (slug)"
          obligatorio
          minLength={3}
          maxLength={60}
          ayuda={ayudaSlug}
          value={valores.slug}
          onChange={(e) => cambiarSlug(e.target.value)}
        />
      </div>
      <Campo
        id="codigoDane"
        etiqueta="Codigo DANE"
        inputMode="numeric"
        maxLength={20}
        value={valores.codigoDane}
        onChange={(e) => cambiar('codigoDane', e.target.value.replace(/[^0-9]/g, ''))}
      />
      <Campo
        id="telefono"
        etiqueta="Telefono"
        maxLength={20}
        value={valores.telefono}
        onChange={(e) => cambiar('telefono', e.target.value)}
      />
      <Campo
        id="municipio"
        etiqueta="Municipio"
        maxLength={80}
        value={valores.municipio}
        onChange={(e) => cambiar('municipio', e.target.value)}
      />
      <Campo
        id="departamento"
        etiqueta="Departamento"
        maxLength={80}
        value={valores.departamento}
        onChange={(e) => cambiar('departamento', e.target.value)}
      />
      <Campo
        id="direccion"
        etiqueta="Direccion"
        maxLength={150}
        value={valores.direccion}
        onChange={(e) => cambiar('direccion', e.target.value)}
      />
      <Campo
        id="correo"
        etiqueta="Correo"
        type="email"
        maxLength={120}
        value={valores.correo}
        onChange={(e) => cambiar('correo', e.target.value)}
      />
    </div>
  )
}
