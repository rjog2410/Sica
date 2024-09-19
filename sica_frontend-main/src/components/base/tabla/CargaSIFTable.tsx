import React, { forwardRef, useImperativeHandle, useState, useMemo, useCallback, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
  Paper,
} from '@mui/material';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { CargaSIFData } from '../../../types';

type Order = 'asc' | 'desc';


interface CargaSIFTableProps {

  data: CargaSIFData[];
  tipo_salmov: string;
}

const CargaSIFTable = forwardRef(({
  data,
  tipo_salmov,
}: CargaSIFTableProps, ref) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof CargaSIFData>('sis_clave');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useImperativeHandle(ref, () => ({
    exportToExcel: handleExportToExcel,
  }));

  const sortedData = useMemo(() => {
    return data?.slice().sort((a, b) => {
      const aValue = a[orderBy] ?? ''
      const bValue = b[orderBy] ?? ''; 
  
      return (aValue < bValue ? -1 : 1) * (order === 'asc' ? 1 : -1);
    });
  }, [data, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);


  useEffect(() => {
  }, [paginatedData]);


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



const handleChangePage = (event: unknown, newPage: number) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Sistema</StyledTableCell>
            <StyledTableCell>Módulo</StyledTableCell>
            <StyledTableCell>Fecha Conciliación</StyledTableCell>
            <StyledTableCell>Fecha Carga</StyledTableCell>
            <StyledTableCell>No. Registros</StyledTableCell>
            <StyledTableCell>Tipo</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
              {paginatedData.map((row, index) => {
                 
                return (
                  <StyledTableRow  key={index}>            
                    <StyledTableCell>{row.sis_clave}</StyledTableCell>
                    <StyledTableCell>{row.mod_clave}</StyledTableCell>
                    <StyledTableCell>{row.fecha_conciliacion}</StyledTableCell>
                    <StyledTableCell>{row.fecha_carga}</StyledTableCell>
                    <StyledTableCell>{row.RegistrosCargados}</StyledTableCell>
                    <StyledTableCell>{tipo_salmov}</StyledTableCell>
                  </StyledTableRow >
                );
                    })}

        </TableBody>
        </Table>    
            <TablePagination
              rowsPerPageOptions={[5, 10, 50, { value: -1, label: 'All' }]}
              component="div"
              count={sortedData?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
    </TableContainer>
  );
});

export default CargaSIFTable;
