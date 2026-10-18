import Campo from '../../../components/ui/Campo'
import {
  conProblema,
  errorCelular,
  errorCorreo,
  errorDocumento,
  errorNombre,
  errorObligatorio,
  filtrarDocumento,
  formatoCorreo,
  nombrePropio,
  primero,
  sinEspacios,
  soloLetras,
  soloNumeros,
} from '../../../lib/validaciones'

export const ADMINISTRADOR_VACIO = {
  tipoDoc: 'CC',
  nroDoc: '',
  nombres: '',
  apellidos: '',
  correo: '',
  celular: '',
}

const TIPOS_DOCUMENTO = [
  { valor: 'CC', texto: 'Cedula de ciudadania' },
  { valor: 'CE', texto: 'Cedula de extranjeria' },
  { valor: 'PPT', texto: 'Permiso de proteccion temporal' },
  { valor: 'TI', texto: 'Tarjeta de identidad' },
  { valor: 'RC', texto: 'Registro civil' },
]

// lo mismo que revisa el backend. devuelve solo los campos con problema
export function revisarAdministrador(valores) {
  return conProblema({
    nroDoc: errorDocumento(valores.tipoDoc, valores.nroDoc),
    nombres: primero([
      errorObligatorio(valores.nombres, 'Los nombres son obligatorios'),
      errorNombre(valores.nombres, 'Los nombres solo llevan letras'),
    ]),
    apellidos: primero([
      errorObligatorio(valores.apellidos, 'Los apellidos son obligatorios'),
      errorNombre(valores.apellidos, 'Los apellidos solo llevan letras'),
    ]),
    correo: errorCorreo(valores.correo),
    celular: errorCelular(valores.celular),
  })
}

// ayudaDocumento: al editar el texto cambia, porque la contrasena ya no es el documento nuevo
// errores: lo que devolvio revisarAdministrador
export default function DatosAdministradorCampos({ valores, alCambiar, ayudaDocumento, errores = {} }) {
  let ayuda = 'Sera su usuario y su contrasena inicial'
  if (ayudaDocumento) {
    ayuda = ayudaDocumento
  }

  function cambiar(campo, valor) {
    alCambiar({ ...valores, [campo]: valor })
  }

  // al cambiar el tipo, el numero se vuelve a filtrar (la CE es la unica con letras)
  function cambiarTipo(tipo) {
    alCambiar({ ...valores, tipoDoc: tipo, nroDoc: filtrarDocumento(valores.nroDoc, tipo) })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="tipoDoc" className="etiqueta">
          Tipo de documento<span className="text-peligro-600"> *</span>
        </label>
        <select id="tipoDoc" className="input" value={valores.tipoDoc} onChange={(e) => cambiarTipo(e.target.value)}>
          {TIPOS_DOCUMENTO.map((tipo) => (
            <option key={tipo.valor} value={tipo.valor}>
              {tipo.texto}
            </option>
          ))}
        </select>
      </div>
      <Campo
        id="nroDoc"
        etiqueta="Numero de documento"
        obligatorio
        minLength={3}
        maxLength={valores.tipoDoc === 'CE' ? 20 : 15}
        inputMode={valores.tipoDoc === 'CE' ? 'text' : 'numeric'}
        ayuda={ayuda}
        error={errores.nroDoc}
        value={valores.nroDoc}
        onChange={(e) => cambiar('nroDoc', filtrarDocumento(e.target.value, valores.tipoDoc))}
      />
      <Campo
        id="nombres"
        etiqueta="Nombres"
        obligatorio
        maxLength={80}
        error={errores.nombres}
        value={valores.nombres}
        onChange={(e) => cambiar('nombres', soloLetras(e.target.value))}
        onBlur={() => cambiar('nombres', nombrePropio(valores.nombres))}
      />
      <Campo
        id="apellidos"
        etiqueta="Apellidos"
        obligatorio
        maxLength={80}
        error={errores.apellidos}
        value={valores.apellidos}
        onChange={(e) => cambiar('apellidos', soloLetras(e.target.value))}
        onBlur={() => cambiar('apellidos', nombrePropio(valores.apellidos))}
      />
      <Campo
        id="correoAdmin"
        etiqueta="Correo"
        type="email"
        maxLength={120}
        placeholder="nombre@correo.com"
        error={errores.correo}
        value={valores.correo}
        onChange={(e) => cambiar('correo', sinEspacios(e.target.value))}
        onBlur={() => cambiar('correo', formatoCorreo(valores.correo))}
      />
      <Campo
        id="celular"
        etiqueta="Celular"
        inputMode="numeric"
        maxLength={10}
        placeholder="3001234567"
        error={errores.celular}
        value={valores.celular}
        onChange={(e) => cambiar('celular', soloNumeros(e.target.value))}
      />
    </div>
  )
}
