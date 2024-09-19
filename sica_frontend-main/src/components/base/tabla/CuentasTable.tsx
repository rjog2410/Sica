import React, {forwardRef, useImperativeHandle, useState, useMemo, useCallback, useEffect} from 'react';
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
import { Cuenta } from '../../../types';

interface CuentasTableProps {
  data: Cuenta[];
  onSelectionChange: (selectedIds: number[]) => void;
  onUpdateCuenta: (cuenta: Cuenta) => void;
  onDeleteCuenta: (id: number) => void;
  onViewRules: (id: number) => void;
}

type Order = 'asc' | 'desc';

const CuentasTable = forwardRef(({
  data,
  onSelectionChange,
  onUpdateCuenta,
  onDeleteCuenta,
  onViewRules,
}: CuentasTableProps, ref) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Cuenta>('cuenta');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useImperativeHandle(ref, () => ({
    exportToExcel: handleExportToExcel,
  }));

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.cuc_clave!);
      setSelected(newSelecteds);
      onSelectionChange(newSelecteds);
      return;
    }
    setSelected([]);
    onSelectionChange([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];
    console.log("ID selected: ", id)
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const handleRequestSort = (property: keyof Cuenta) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const sortedData = useMemo(() => {
    return data?.slice().sort((a, b) => {
      const aValue = a[orderBy] ?? ''
      const bValue = b[orderBy] ?? ''; 
  
      return (aValue < bValue ? -1 : 1) * (order === 'asc' ? 1 : -1);
    });
  }, [data, order, orderBy]);

  const paginatedData = useMemo(() => {
    setSelected([]);
    return sortedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);


  useEffect(() => {

  }, [paginatedData]);

  const handleExportToExcel = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cuentas');

    worksheet.columns = [
      { header: 'Cuenta', key: 'cuenta', width: 20 },
      { header: 'Tipo Ente', key: 'tipo_ente', width: 10 },
      { header: 'Ente', key: 'ente', width: 10 },
      { header: 'Tipo Conciliación', key: 'tipo_conciliacion', width: 20 },
    ];

    sortedData.forEach((cuenta) => {
      worksheet.addRow({
        cuenta: cuenta.cuc_cuenta,
        tipo_ente: cuenta.cuc_tipo_ente || 'N/A',
        ente: cuenta.cuc_ente || 'N/A',
        tipo_conciliacion: cuenta.cuc_consolida_ente === 'S' ? 'E': (cuenta.cuc_inc_saldo === 'S' ? 'S' : (cuenta.cuc_inc_movs === 'S' && 'M')) ,
      });
    });

    const today = new Date();
    const date = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
    const fileName = `Cuentas${date}.xlsx`;

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
    <TableContainer component={Paper} style={{ height: '450px', width: '100%' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selected?.length > 0 && selected?.length < data?.length}
                checked={data?.length > 0 && selected?.length === data?.length}
                onChange={handleSelectAllClick}
              />
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'cuenta'}
                direction={orderBy === 'cuenta' ? order : 'asc'}
                onClick={() => handleRequestSort('cuenta')}
              >
                Cuenta
              </TableSortLabel>
            </TableCell>
            <TableCell>Tipo Ente</TableCell>
            <TableCell>Ente</TableCell>
            <TableCell>Tipo Conciliación</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData?.map((row) => {
            const isItemSelected = row.cuc_clave ? isSelected(row.cuc_clave) : false;
            return (
              <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.cuc_clave}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={isItemSelected}
                  onChange={() => {
                    if(isItemSelected) {
                      setSelected(selected?.filter(item => item !==row.cuc_clave))
                      onSelectionChange(selected?.filter(item => item !==row.cuc_clave));
                    }else {
                      setSelected([row.cuc_clave!]);
                      onSelectionChange([row.cuc_clave!]);
                    }
                  }}
                  />
                </TableCell>
                <TableCell>{row.cuc_cuenta}</TableCell>
                <TableCell>{row.cuc_tipo_ente || 'N/A'}</TableCell>
                <TableCell>{row.cuc_ente || 'N/A'}</TableCell>
                <TableCell>{row.cuc_consolida_ente === 'S' ? 'E': (row.cuc_inc_saldo === 'S' ? 'S' : (row.cuc_inc_movs === 'S' && 'M'))}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    onUpdateCuenta(row);
                  }} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDeleteCuenta(row.cuc_clave!)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={(e) => {
                    e.stopPropagation(); // Evitar que el clic en la lupa seleccione la fila
                    onViewRules(row.cuc_clave!);
                  }} aria-label="view">
                    🔎
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
        count={sortedData?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
});

export default CuentasTable;
