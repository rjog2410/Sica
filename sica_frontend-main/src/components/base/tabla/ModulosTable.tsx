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
import { Modulo } from '../../../types';

interface ModulosTableProps {
  data: Modulo[];
  onSelectionChange: (selectedIds: string[]) => void;
  onUpdateModulo: (modulo: Modulo) => void;
  onDeleteModulo: (clave_modulo: string) => void;
}

type Order = 'asc' | 'desc';

const ModulosTable = forwardRef(({
  data,
  onSelectionChange,
  onUpdateModulo,
  onDeleteModulo,
}: ModulosTableProps, ref: Ref<{ exportToExcel: () => void }>) => {

  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Modulo>('clave_modulo');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useImperativeHandle(ref, () => ({
    exportToExcel: handleExportToExcel,
  }));

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.clave_modulo);
      setSelected(newSelecteds);
      onSelectionChange(newSelecteds);
      return;
    }
    setSelected([]);
    onSelectionChange([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, clave_modulo: string) => {
    const selectedIndex = selected.indexOf(clave_modulo);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, clave_modulo);
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

  const handleRequestSort = (property: keyof Modulo) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isSelected = (clave_modulo: string) => selected.indexOf(clave_modulo) !== -1;

  const sortedData = useMemo(() => {
    return data.slice().sort((a, b) => {
      if (orderBy === 'clave_modulo' || orderBy === 'nombre_modulo') {
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
    const worksheet = workbook.addWorksheet('Módulos');

    worksheet.columns = [
      { header: 'Clave Módulo', key: 'clave_modulo', width: 30 },
      { header: 'Nombre Módulo', key: 'nombre_modulo', width: 30 },
      { header: 'Fecha Carga', key: 'fecha_carga', width: 20 },
      { header: 'Número de Registros', key: 'num_registros', width: 20 },
      { header: 'Fecha Información', key: 'fecha_informacion', width: 20 },
      { header: 'Tipo Transacción', key: 'tipo_transaccion', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Agrupación Reportes', key: 'agrupacion_reportes', width: 20 },
    ];

    sortedData.forEach((modulo) => {
      worksheet.addRow(modulo);
    });

    const today = new Date();
    const date = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
    const fileName = `Modulos_${date}.xlsx`;

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
            <TableCell padding="checkbox" sx={tableHeaderCellStyle}>
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all modules' }}
                sx={checkboxStyle}
              />
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>
              <TableSortLabel
                active={orderBy === 'clave_modulo'}
                direction={orderBy === 'clave_modulo' ? order : 'asc'}
                onClick={() => handleRequestSort('clave_modulo')}
                sx={tableSortLabelStyle}
              >
                Clave Módulo
              </TableSortLabel>
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>
              <TableSortLabel
                active={orderBy === 'nombre_modulo'}
                direction={orderBy === 'nombre_modulo' ? order : 'asc'}
                onClick={() => handleRequestSort('nombre_modulo')}
                sx={tableSortLabelStyle}
              >
                Nombre Módulo
              </TableSortLabel>
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>Fecha Carga</TableCell>
            <TableCell sx={tableHeaderCellStyle}>Número de Registros</TableCell>
            <TableCell sx={tableHeaderCellStyle}>Fecha Información</TableCell>
            <TableCell sx={tableHeaderCellStyle}>Tipo Transacción</TableCell>
            <TableCell sx={tableHeaderCellStyle}>Status</TableCell>
            <TableCell sx={tableHeaderCellStyle}>Agrupación Reportes</TableCell>
            <TableCell sx={tableHeaderCellStyle}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => {
            const isItemSelected = isSelected(row.clave_modulo);
            const labelId = `enhanced-table-checkbox-${index}`; // Usar índice para garantizar unicidad

            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.clave_modulo)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={index} // Usar el índice como key
                selected={isItemSelected}
                sx={getTableRowStyle(isItemSelected)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </TableCell>
                <TableCell component="th" id={labelId} scope="row" sx={{ paddingLeft: 3 }}>
                  {row.clave_modulo}
                </TableCell>
                <TableCell sx={{ paddingLeft: 3 }}>
                  {row.nombre_modulo}
                </TableCell>
                <TableCell>{row.fecha_carga || 'N/A'}</TableCell>
                <TableCell>{row.num_registros !== null ? row.num_registros : 'N/A'}</TableCell>
                <TableCell>{row.fecha_informacion || 'N/A'}</TableCell>
                <TableCell>{row.tipo_transaccion || 'N/A'}</TableCell>
                <TableCell>{row.status || 'N/A'}</TableCell>
                <TableCell>{row.agrupacion_reportes || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateModulo(row);
                    }}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteModulo(row.clave_modulo);
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
        labelRowsPerPage = "Filas por página"
        rowsPerPageOptions={[5, 20, 50]}
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

// Estilos para las celdas del encabezado
const tableHeaderCellStyle = {
  backgroundColor: '#013A63',
  color: '#ffffff',
  fontWeight: 'bold',
  '&:hover': { backgroundColor: '#013052' },
};

// Estilos para los checkbox
const checkboxStyle = {
  color: '#ffffff',
  '&.Mui-checked': { color: '#D32F2F' },
  '&.MuiCheckbox-indeterminate': { color: '#ff9800' },
  '&:hover': { color: '#D32F2F' },
  '&.Mui-checked:hover': { color: '#D32F2F' },
  '&.MuiCheckbox-indeterminate:hover': { color: '#ffb74d' },
};

// Estilos para el label de ordenamiento
const tableSortLabelStyle = {
  borderRadius: 3,
  borderWidth: 1,
  paddingLeft: 1,
  color: '#ffffff',
  '&:hover': { color: '#ffeb3b', backgroundColor: '#01243D' },
  '&.Mui-active': { color: '#ffeb3b' },
  '& .MuiTableSortLabel-icon': { color: '#ffeb3b', '&:hover': { color: '#ffeb3b' } },
  '&.Mui-active .MuiTableSortLabel-icon': { color: '#ffeb3b' },
};

// Función para obtener estilos de las filas
const getTableRowStyle = (isItemSelected: boolean) => ({
  backgroundColor: isItemSelected ? '#8FB6C7' : (theme: any) => theme.palette.action.hover,
  '&:nth-of-type(odd)': {
    backgroundColor: isItemSelected ? '#8FB6C7' : '#f0f0f0',
  },
  '&:nth-of-type(even)': {
    backgroundColor: isItemSelected ? '#629DB7' : '#ffffff',
  },
  '&:hover': {
    backgroundColor: '#00708F',
    '& .MuiTableCell-root': {
      color: 'white',
      backgroundColor: '#00708F',
      '& [aria-label="delete"]': {
        color: '#FF0000',
        '&:hover': {
          color: '#FF0000',
        },
      },
      '& [aria-label="edit"]': {
        color: '#45C243',
        '&:hover': {
          color: '#45C243',
        },
      },
      '& .MuiCheckbox-root': {
        color: isItemSelected ? 'red' : 'white',
      },
    },
  },
  '& .MuiTableCell-root': {
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    '& .MuiCheckbox-root': {
      color: isItemSelected ? '#ffeb3b' : '#1976d2',
    },
    '& .Mui-checked': {
      color: '#D32F2F',
    },
    '& .MuiCheckbox-indeterminate': {
      color: '#ffb74d',
    },
    '& [aria-label="edit"]': {
      color: 'green',
      '&:hover': {
        color: 'darkgreen',
      },
    },
    '& [aria-label="delete"]': {
      color: '#D32F2F',
    },
  },
});

export default ModulosTable;
