import React, {useEffect, useMemo, useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  DialogTitle, DialogContent, Dialog, Box, IconButton
} from '@mui/material';
import {Conciliacion, ConciliacionCuenta, ConciliacionCuentaDetalle, Cuenta} from '../../../types';

interface Props {
  data: ConciliacionCuenta[];
  filtros: any;
}

type Order = 'asc' | 'desc';

const ConciliacionTable: React.FC<Props> = ({ data,filtros }) => {

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<any>('con_cuenta');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentReg, setCurrentReg] = useState<any>(null);

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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {

  }, [paginatedData]);

  useEffect(() => {
    if(!!currentReg){
      const search : ConciliacionCuentaDetalle = {
        cuc_mod_sis_clave: filtros?.sistema,
        cuc_mod_clave: filtros?.modulo,
        con_fecha: filtros?.fecha,
        oficina: filtros?.oficina,
        moneda: filtros?.moneda
      }
    }
  }, [currentReg]);

  return (
      <Box>
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
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.con_cuenta}</TableCell>
                    <TableCell>{row.con_scta1}</TableCell>
                    <TableCell>{row.con_scta2}</TableCell>
                    <TableCell>{row.con_scta3}</TableCell>
                    <TableCell>{row.con_scta4}</TableCell>
                    <TableCell>{row.con_scta5}</TableCell>
                    <TableCell>{row.con_scta6}</TableCell>
                    <TableCell>{row.con_scta7}</TableCell>
                    <TableCell>{row.con_tipo_ente}</TableCell>
                    <TableCell>{row.con_ente}</TableCell>
                    <TableCell>{row.con_importe_sif}</TableCell>
                    <TableCell>{row.con_importe_ao}</TableCell>
                    <TableCell>{row.con_dif}</TableCell>
                    <TableCell><IconButton onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(!isOpen);
                      setCurrentReg(row)
                    }} aria-label="view">
                      🔎
                    </IconButton></TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={sortedData?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
        <Dialog
            open={isOpen}
            onClose={()=> {
              setIsOpen(!isOpen)
              setCurrentReg(null)
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"........."}
          </DialogTitle>
          <DialogContent>

          </DialogContent>
        </Dialog>
      </Box>

  );
};

export default ConciliacionTable;
