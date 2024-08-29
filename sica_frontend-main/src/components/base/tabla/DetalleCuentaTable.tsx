// src/components/base/tabla/DetalleCuentaTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DetalleCuenta } from '../../../types';

interface DetalleCuentaTableProps {
  data: DetalleCuenta[];
}

const DetalleCuentaTable: React.FC<DetalleCuentaTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {data.map((columna) => (
              <TableCell key={columna.tit_columna}>{columna.tit_descripcion}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Aquí agregarías las filas correspondientes según los datos */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DetalleCuentaTable;
