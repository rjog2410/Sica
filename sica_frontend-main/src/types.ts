export interface GenericItem {
  sis_clave: string;
  [key: string]: any;
}

export interface ColumnConfig {
  field: string;
  headerName: string;
}

export interface GenericData {
  [key: string]: any;
}

export interface Pantalla {
  id: number;
  nombre: string;
  descripcion: string;
  funciones: number[];
}

export interface Funcion {
  id: number;
  nombre: string;
  descripcion: string;
  columnas?: string[];
  filtros?: string[];
}

export interface DataJson {
  pantallas: Pantalla[];
  funciones: Funcion[];
}

export interface Sistema {
  sis_clave: string; // Clave única para identificar el sistema
  sis_nombre: string; // Nombre del sistema
  filtros?: string[]; // Array opcional para múltiples filtros
}

export interface SistemasTableProps {
  data: Sistema[]; // Lista de sistemas a mostrar en la tabla
  onSelectionChange: (selectedIds: string[]) => void; // Callback cuando se seleccionan sistemas
  onUpdateSistema: (sistema: Sistema) => void; // Callback para actualizar un sistema
  onDeleteSistema: (sis_clave: string) => void; // Callback para eliminar un sistema por clave
  filterValue: string; // Valor para filtrar por sis_clave
}

export interface Modulo {
  clave_sistema: string;        // Clave del sistema al que pertenece el módulo
  clave_modulo: string;         // Clave única del módulo
  nombre_modulo: string;        // Nombre del módulo
  fecha_carga: string | null;   // Fecha de carga del módulo, puede ser nula
  num_registros: number | null; // Número de registros asociados al módulo
  fecha_informacion: string | null; // Fecha de la última actualización de información, puede ser nula
  tipo_transaccion: 'A' | 'S' | null;  // Tipo de transacción: 'A' o 'S', puede ser nulo
  status: 'S' | 'N' | null;            // Estatus del módulo: 'S' o 'N', puede ser nulo
  agrupacion_reportes: string | null;  // Cadena de agrupación de reportes, puede ser nula o cualquier string
}

// src/types/index.ts
export interface Columna {
  clave_sistema: string;  // Clave del sistema al que pertenece la columna
  clave_modulo: string;   // Clave del módulo al que pertenece la columna
  numero_columna: number; // Número de la columna
  titulo: string;         // Título o descripción de la columna
}


export interface Cuenta {
  id?: number; 
  clave_sistema: string;
  clave_modulo: string;
  cuenta: string;
  clave_regla: string;
  descripcion: string;
  reg_cuc_clave: number; // Este campo es de tipo número
  reg_tit_mod_sis_clave: string;
  reg_tit_mod_clave: string;
  reg_tit_columna: number;  
  subcta1: string | null;
  subcta2: string | null;
  subcta3: string | null;
  subcta4: string | null;
  subcta5: string | null;
  subcta6: string | null;
  subcta7: string | null;
  tipo_ente: number | null;
  ente: number | string | null;
  tipo_conciliacion: 'E' | 'S' | 'M' | 'N';
  consolida_ente: string;
  inc_saldo: string;
  inc_movs: string;
}
export interface Regla {
  id: number;
  clave_regla: string;
  descripcion: string;
  reg_cuc_clave: number;
  reg_tit_mod_sis_clave: string;
  reg_tit_mod_clave: string;
  reg_tit_columna: number;
  reg_secuencia: number;
  reg_operador: string;
  reg_valor: string;
}

export interface Formula {
  for_cuc_clave: number;
  for_tit_mod_sis_clave: string;
  for_tit_mod_clave: string;
  for_tit_columna: number;
  for_secuencia: number;
  for_operador: string;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: (confirmed: boolean) => void;
}



export interface ExtraccionParams {
  sistema: string;
  modulo: string;
  tipoInformacion: string;
  fechaInicio: string;
  fechaFin: string;
  borrarInformacion: boolean;
}


export interface TraductorParams {
  sistema: string;
  modulo: string;
  fechaInicio: string;
  fechaFin: string;
  tipoInformacion: string;
}

export interface Conciliacion {
  sistema: string;
  modulo: string;
  fecha: string;
  oficina: string;
  moneda: string;
  cuentaContable: string;
  tipoEnte: string;
  ente: string;
  importeSIF: number;
  importeOperativo: number;
  diferencia: number;
}


export interface DetalleCuenta {
  tit_columna: string;
  tit_descripcion: string;
}

export interface FiltrosDetalle {
  sistema: string;
  modulo: string;
}


export interface TituloColumna {
  tit_columna: string;
  tit_descripcion: string;
}

// src/types.ts
export interface DetalleCuentaConsultas {
  cuenta: string;
  tipo_ente: string;
  ente: string;
  importe_sif: number;
  importe_area: number;
  diferencia: number;
}





export interface CargaAOData {
  fechaCarga: string;
  sistema: string;
  modulo: string;
  fechaOperativa: string;
  tipoConciliacion: string;
  registrosCargados: number;
  registrosConciliados: number;
}