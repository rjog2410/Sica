// src/components/base/tabla/DynamicTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface DynamicTableProps {
  columnas: { tit_columna: string; tit_descripcion: string }[];
  data: { [key: string]: any }[];
}

const DynamicTable: React.FC<DynamicTableProps> = ({ columnas, data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columnas.map((columna) => (
              <TableCell key={columna.tit_columna}>{columna.tit_descripcion}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columnas.map((columna) => (
                <TableCell key={columna.tit_columna}>{row[columna.tit_columna]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
