// src/components/base/tabla/CargaAOTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface CargaAOTableProps {
  data: {
    fechaCarga: string;
    sistema: string;
    modulo: string;
    fechaOperativa: string;
    tipoConciliacion: string;
    registrosCargados: number;
    registrosConciliados: number;
  }[];
}

const CargaAOTable: React.FC<CargaAOTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha Carga</TableCell>
            <TableCell>Sistema</TableCell>
            <TableCell>Módulo</TableCell>
            <TableCell>Fecha Operativa</TableCell>
            <TableCell>Tipo Conciliación</TableCell>
            <TableCell>No. Registros Cargados</TableCell>
            <TableCell>No. Registros Conciliados</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.fechaCarga}</TableCell>
              <TableCell>{row.sistema}</TableCell>
              <TableCell>{row.modulo}</TableCell>
              <TableCell>{row.fechaOperativa}</TableCell>
              <TableCell>{row.tipoConciliacion}</TableCell>
              <TableCell>{row.registrosCargados}</TableCell>
              <TableCell>{row.registrosConciliados}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CargaAOTable;
