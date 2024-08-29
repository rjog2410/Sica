// src/utils/utils.ts

import { format } from 'date-fns';

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param date Fecha en formato ISO o Date
 * @returns Fecha en formato DD/MM/YYYY
 */
export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy');
};

/**
 * Formatea una fecha en formato DD/MM/YYYY HH:mm
 * @param date Fecha en formato ISO o Date
 * @returns Fecha en formato DD/MM/YYYY HH:mm
 */
export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

/**
 * Formatea un monto en formato 999,999.00
 * @param amount Monto a formatear
 * @returns Monto formateado
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
