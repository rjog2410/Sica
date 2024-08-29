// modulosData.ts

import { Modulo, ColumnConfig } from '../../types'; // Ajusta la ruta según sea necesario

export const modulosData: Modulo[] = [
  {
    mod_clave: "MOD001",
    mod_nombre: "Modulo de Finanzas",
    mod_fecha_carga: "2023-07-01",
    mod_registros: 1500,
    mod_fecha_info: "2023-07-01",
    tipo_trans: "Ingreso",
    status_trans: "Activo",
    mod_agrup_rep: "Finanzas",
    mod_sis_clave: "SIS001"
  },
  {
    mod_clave: "MOD002",
    mod_nombre: "Modulo de Recursos Humanos",
    mod_fecha_carga: "2023-07-02",
    mod_registros: 200,
    mod_fecha_info: "2023-07-02",
    tipo_trans: "Gasto",
    status_trans: "Inactivo",
    mod_agrup_rep: "RRHH",
    mod_sis_clave: "SIS002"
  },
  // Otros módulos...
];

export const allColumns: ColumnConfig[] = [
  { field: 'mod_clave', headerName: 'Clave del Módulo' },
  { field: 'mod_nombre', headerName: 'Nombre del Módulo' },
  { field: 'mod_fecha_carga', headerName: 'Fecha Carga' },
  { field: 'mod_registros', headerName: 'No. Registros' },
  { field: 'mod_fecha_info', headerName: 'Fecha Información' },
  { field: 'tipo_trans', headerName: 'Tipo Transacción' },
  { field: 'status_trans', headerName: 'Estatus' },
  { field: 'mod_agrup_rep', headerName: 'Agrupación Reportes' },
  { field: 'mod_sis_clave', headerName: 'Clave del Sistema' }
];
