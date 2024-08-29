import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

interface CargaSIFData {
  sistema: string;
  modulo: string;
  fechaConciliacion: string;
  fechaCarga: string;
  registros: number;
  tipo: string;
}

interface CargaSIFTableProps {
  data: CargaSIFData[];
}

const CargaSIFTable: React.FC<CargaSIFTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sistema</TableCell>
            <TableCell>Módulo</TableCell>
            <TableCell>Fecha Conciliación</TableCell>
            <TableCell>Fecha Carga</TableCell>
            <TableCell>No. Registros</TableCell>
            <TableCell>Tipo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.sistema}</TableCell>
              <TableCell>{row.modulo}</TableCell>
              <TableCell>{row.fechaConciliacion}</TableCell>
              <TableCell>{row.fechaCarga}</TableCell>
              <TableCell>{row.registros}</TableCell>
              <TableCell>{row.tipo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CargaSIFTable;
