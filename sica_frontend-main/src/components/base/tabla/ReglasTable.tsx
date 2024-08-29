import React, { useState, forwardRef, useImperativeHandle, Ref, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Regla } from '../../../types';

interface ReglasTableProps {
  data: Regla[];
  onSelectionChange: (selectedIds: number[]) => void;
  onUpdateRegla: (regla: Regla) => void;
  onDeleteRegla: (secuencia: number) => void;
}

type Order = 'asc' | 'desc';

const ReglasTable = forwardRef(({
  data,
  onSelectionChange,
  onUpdateRegla,
  onDeleteRegla,
}: ReglasTableProps, ref: Ref<{ exportToExcel: () => void }>) => {

  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Regla>('reg_secuencia');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useImperativeHandle(ref, () => ({
    exportToExcel: handleExportToExcel,
  }));

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.reg_secuencia);
      setSelected(newSelecteds);
      onSelectionChange(newSelecteds);
      return;
    }
    setSelected([]);
    onSelectionChange([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, secuencia: number) => {
    const selectedIndex = selected.indexOf(secuencia);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, secuencia);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
    onSelectionChange(newSelected);
  };

  const handleRequestSort = (property: keyof Regla) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isSelected = (secuencia: number) => selected.indexOf(secuencia) !== -1;

  const sortedData = useMemo(() => {
    return data.slice().sort((a, b) => {
      if (orderBy === 'reg_secuencia' || orderBy === 'reg_tit_columna') {
        return (a[orderBy] < b[orderBy] ? -1 : 1) * (order === 'asc' ? 1 : -1);
      }
      return 0;
    });
  }, [data, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleExportToExcel = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reglas');

    worksheet.columns = [
      { header: 'Secuencia', key: 'reg_secuencia', width: 15 },
      { header: 'Clave Sistema', key: 'reg_tit_mod_sis_clave', width: 30 },
      { header: 'Clave Módulo', key: 'reg_tit_mod_clave', width: 30 },
      { header: 'Número Columna', key: 'reg_tit_columna', width: 20 },
      { header: 'Operador', key: 'reg_operador', width: 20 },
      { header: 'Valor', key: 'reg_valor', width: 30 },
    ];

    sortedData.forEach((regla) => {
      worksheet.addRow(regla);
    });

    const today = new Date();
    const date = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
    const fileName = `Reglas_${date}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  }, [sortedData]);

  const handleChangePage = (_event: unknown, newPage: number) => {
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
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all rules' }}
              />
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'reg_secuencia'}
                direction={orderBy === 'reg_secuencia' ? order : 'asc'}
                onClick={() => handleRequestSort('reg_secuencia')}
              >
                Secuencia
              </TableSortLabel>
            </TableCell>
            <TableCell>Clave Sistema</TableCell>
            <TableCell>Clave Módulo</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'reg_tit_columna'}
                direction={orderBy === 'reg_tit_columna' ? order : 'asc'}
                onClick={() => handleRequestSort('reg_tit_columna')}
              >
                Número Columna
              </TableSortLabel>
            </TableCell>
            <TableCell>Operador</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => {
            const isItemSelected = isSelected(row.reg_secuencia);
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.reg_secuencia)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.reg_secuencia}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </TableCell>
                <TableCell component="th" id={labelId} scope="row">
                  {row.reg_secuencia}
                </TableCell>
                <TableCell>{row.reg_tit_mod_sis_clave}</TableCell>
                <TableCell>{row.reg_tit_mod_clave}</TableCell>
                <TableCell>{row.reg_tit_columna}</TableCell>
                <TableCell>{row.reg_operador}</TableCell>
                <TableCell>{row.reg_valor}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateRegla(row);
                    }}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRegla(row.reg_secuencia);
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
});

export default ReglasTable;
