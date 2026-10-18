import Campo from '../../../components/ui/Campo'
import {
  conProblema,
  errorCodigoDane,
  errorCorreo,
  errorDireccion,
  errorLugar,
  errorObligatorio,
  errorTelefono,
  errorTextoBasico,
  espacios,
  formatoCorreo,
  nombrePropio,
  primero,
  sinEspacios,
  soloNumeros,
} from '../../../lib/validaciones'
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

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

// lo mismo que revisa el backend. devuelve solo los campos con problema
export function revisarInstitucion(valores) {
  let nombreCorto = ''
  if (espacios(valores.nombre).length < 3) {
    nombreCorto = 'El nombre debe tener entre 3 y 150 caracteres'
  }

  let slug = ''
  if (valores.slug.length < 3 || !SLUG.test(valores.slug)) {
    slug = 'El enlace debe tener entre 3 y 60 caracteres: minusculas, numeros y guiones, sin espacios'
  }

  return conProblema({
    nombre: primero([
      errorObligatorio(valores.nombre, 'El nombre es obligatorio'),
      nombreCorto,
      errorTextoBasico(valores.nombre, 'El nombre tiene caracteres que no se permiten'),
    ]),
    slug: slug,
    codigoDane: errorCodigoDane(valores.codigoDane),
    municipio: errorLugar(valores.municipio, 'El municipio solo lleva letras'),
    departamento: errorLugar(valores.departamento, 'El departamento solo lleva letras'),
    direccion: errorDireccion(valores.direccion),
    telefono: errorTelefono(valores.telefono),
    correo: errorCorreo(valores.correo),
  })
}

// valores: objeto con los campos de INSTITUCION_VACIA
// slugAutomatico: mientras sea true el enlace se arma solo a partir del nombre
// errores: lo que devolvio revisarInstitucion
export default function DatosInstitucionCampos({ valores, alCambiar, slugAutomatico, setSlugAutomatico, urlFront, errores = {} }) {
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
          error={errores.nombre}
          value={valores.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)}
          onBlur={() => alCambiar({ ...valores, nombre: espacios(valores.nombre) })}
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
          error={errores.slug}
          value={valores.slug}
          onChange={(e) => cambiarSlug(e.target.value)}
        />
      </div>
      <Campo
        id="codigoDane"
        etiqueta="Codigo DANE"
        inputMode="numeric"
        maxLength={12}
        placeholder="12 numeros"
        error={errores.codigoDane}
        value={valores.codigoDane}
        onChange={(e) => cambiar('codigoDane', soloNumeros(e.target.value))}
      />
      <Campo
        id="telefono"
        etiqueta="Telefono"
        inputMode="numeric"
        maxLength={10}
        placeholder="6041234567"
        error={errores.telefono}
        value={valores.telefono}
        onChange={(e) => cambiar('telefono', soloNumeros(e.target.value))}
      />
      <Campo
        id="municipio"
        etiqueta="Municipio"
        maxLength={80}
        error={errores.municipio}
        value={valores.municipio}
        onChange={(e) => cambiar('municipio', e.target.value)}
        onBlur={() => cambiar('municipio', nombrePropio(valores.municipio))}
      />
      <Campo
        id="departamento"
        etiqueta="Departamento"
        maxLength={80}
        error={errores.departamento}
        value={valores.departamento}
        onChange={(e) => cambiar('departamento', e.target.value)}
        onBlur={() => cambiar('departamento', nombrePropio(valores.departamento))}
      />
      <Campo
        id="direccion"
        etiqueta="Direccion"
        maxLength={150}
        placeholder="Calle 10 # 5-20"
        error={errores.direccion}
        value={valores.direccion}
        onChange={(e) => cambiar('direccion', e.target.value)}
        onBlur={() => cambiar('direccion', espacios(valores.direccion))}
      />
      <Campo
        id="correo"
        etiqueta="Correo"
        type="email"
        maxLength={120}
        placeholder="colegio@correo.com"
        error={errores.correo}
        value={valores.correo}
        onChange={(e) => cambiar('correo', sinEspacios(e.target.value))}
        onBlur={() => cambiar('correo', formatoCorreo(valores.correo))}
      />
    </div>
  )
}
