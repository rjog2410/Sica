import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Conciliacion } from '../../../types';

interface Props {
  data: Conciliacion[];
}

const ConciliacionTable: React.FC<Props> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cuenta Contable</TableCell>
            <TableCell>S1</TableCell>
            <TableCell>S2</TableCell>
            <TableCell>S3</TableCell>
            <TableCell>S4</TableCell>
            <TableCell>S5</TableCell>
            <TableCell>S6</TableCell>
            <TableCell>S7</TableCell>
            <TableCell>Tipo Ente</TableCell>
            <TableCell>Ente</TableCell>
            <TableCell>Importe SIF</TableCell>
            <TableCell>Importe Área</TableCell>
            <TableCell>Diferencia</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.cuentaContable}</TableCell>
              <TableCell>{row.tipoEnte}</TableCell>
              <TableCell>{row.ente}</TableCell>
              <TableCell>{row.importeSIF}</TableCell>
              <TableCell>{row.importeOperativo}</TableCell>
              <TableCell>{row.diferencia}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ConciliacionTable;
