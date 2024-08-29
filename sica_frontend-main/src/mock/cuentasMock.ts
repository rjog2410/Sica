// src/data/cuentasMock.ts
import { Cuenta, Regla } from "../types";

export const cuentasMock: Cuenta[] = [
  {
    clave_sistema: "SISTEMA1",
    clave_modulo: "MODULO1",
    cuenta: "1234567",
    tipo_ente: "01",
    ente: "000001",
    tipo_conciliacion: "S",
  },
  {
    clave_sistema: "SISTEMA2",
    clave_modulo: "MODULO2",
    cuenta: "2345678",
    tipo_ente: "02",
    ente: "000002",
    tipo_conciliacion: "N",
  },
  // Añade más cuentas según sea necesario
];

export const reglasMock: Regla[] = [
  {
    secuencia: 1,
    numero_columna: 1,
    operador: "+",
    valor: "100",
  },
  {
    secuencia: 2,
    numero_columna: 2,
    operador: "-",
    valor: "50",
  },
  // Añade más reglas según sea necesario
];
