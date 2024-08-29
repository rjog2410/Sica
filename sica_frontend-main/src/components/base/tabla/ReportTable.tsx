// src/components/base/tabla/ReportTable.tsx

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ReporteConciliacion } from '../../../pages/Reportes/interfaces';
import { formatCurrency, formatDate } from '../../../pages/Reportes/utils';

interface ReportTableProps {
  data: ReporteConciliacion[];
}

const ReportTable: React.FC<ReportTableProps> = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Sistema</TableCell>
          <TableCell>Módulo</TableCell>
          <TableCell>Fecha</TableCell>
          <TableCell>Cuenta</TableCell>
          <TableCell>Ente</TableCell>
          <TableCell>Importe SIF</TableCell>
          <TableCell>Importe Operativo</TableCell>
          <TableCell>Diferencia</TableCell>
          <TableCell>Nivel de Agrupación</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.cuenta}>
            <TableCell>{item.sistema}</TableCell>
            <TableCell>{item.modulo}</TableCell>
            <TableCell>{formatDate(item.fecha)}</TableCell>
            <TableCell>{item.cuenta}</TableCell>
            <TableCell>{item.ente}</TableCell>
            <TableCell>{formatCurrency(item.importe_sif)}</TableCell>
            <TableCell>{formatCurrency(item.importe_operativo)}</TableCell>
            <TableCell>{formatCurrency(item.diferencia)}</TableCell>
            <TableCell>{item.nivel_agrupacion}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReportTable;
