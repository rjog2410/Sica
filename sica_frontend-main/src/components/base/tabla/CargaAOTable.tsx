// src/components/base/tabla/CargaAOTable.tsx
import { styled } from '@mui/material/styles';
import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


interface CargaAOTableProps {

  data: {
    registrosCargados: number,
    registrosConciliados: number,
    fecha_informacion: string,
    mod_sis_clave: string,
    tipo_salmov: string,
    mod_clave: string,
    fecha_carga: string,
  }[];
}


const CargaAOTable: React.FC<CargaAOTableProps> = ({ data }) => {
  console.log("datos table: ",data);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <StyledTableCell>Fecha Carga</StyledTableCell>
            <StyledTableCell>Sistema</StyledTableCell>
            <StyledTableCell>Módulo</StyledTableCell>
            <StyledTableCell>Fecha Operativa</StyledTableCell>
            <StyledTableCell>Tipo Conciliación</StyledTableCell>
            <StyledTableCell>No. Registros Cargados</StyledTableCell>
            <StyledTableCell>No. Registros Conciliados</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow  key={index}>            
              <StyledTableCell >{row.fecha_carga}</StyledTableCell  >
              <StyledTableCell >{row.mod_sis_clave}</StyledTableCell >
              <StyledTableCell >{row.mod_clave}</StyledTableCell  >
              <StyledTableCell >{row.fecha_informacion}</StyledTableCell  >
              <StyledTableCell >{row.tipo_salmov}</StyledTableCell  >
              <StyledTableCell >{row.registrosCargados}</StyledTableCell  >
              <StyledTableCell >{row.registrosConciliados}</StyledTableCell  >
            </StyledTableRow >
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CargaAOTable;
