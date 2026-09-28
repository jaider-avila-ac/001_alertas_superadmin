import Campo from '../../../components/ui/Campo'

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

export default function DatosAdministradorCampos({ valores, alCambiar }) {
  function cambiar(campo, valor) {
    alCambiar({ ...valores, [campo]: valor })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="tipoDoc" className="etiqueta">
          Tipo de documento<span className="text-peligro-600"> *</span>
        </label>
        <select id="tipoDoc" className="input" value={valores.tipoDoc} onChange={(e) => cambiar('tipoDoc', e.target.value)}>
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
        maxLength={20}
        ayuda="Sera su usuario y su contrasena inicial"
        value={valores.nroDoc}
        onChange={(e) => cambiar('nroDoc', e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
      />
      <Campo
        id="nombres"
        etiqueta="Nombres"
        obligatorio
        maxLength={80}
        value={valores.nombres}
        onChange={(e) => cambiar('nombres', e.target.value)}
      />
      <Campo
        id="apellidos"
        etiqueta="Apellidos"
        obligatorio
        maxLength={80}
        value={valores.apellidos}
        onChange={(e) => cambiar('apellidos', e.target.value)}
      />
      <Campo
        id="correoAdmin"
        etiqueta="Correo"
        type="email"
        maxLength={120}
        value={valores.correo}
        onChange={(e) => cambiar('correo', e.target.value)}
      />
      <Campo
        id="celular"
        etiqueta="Celular"
        inputMode="numeric"
        maxLength={10}
        placeholder="3001234567"
        value={valores.celular}
        onChange={(e) => cambiar('celular', e.target.value.replace(/[^0-9]/g, ''))}
      />
    </div>
  )
}
