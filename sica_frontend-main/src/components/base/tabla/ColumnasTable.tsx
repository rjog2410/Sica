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
import { Columna } from '../../../types';

interface ColumnasTableProps {
  data: Columna[];
  onSelectionChange: (selectedIds: number[]) => void;
  onUpdateColumna: (columna: Columna) => void;
  onDeleteColumna: (numero_columna: number) => void;
}

type Order = 'asc' | 'desc';

const ColumnasTable = forwardRef(({
  data,
  onSelectionChange,
  onUpdateColumna,
  onDeleteColumna,
}: ColumnasTableProps, ref: Ref<{ exportToExcel: () => void }>) => {

  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Columna>('numero_columna');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useImperativeHandle(ref, () => ({
    exportToExcel: handleExportToExcel,
  }));

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelecteds = event.target.checked ? data.map((n) => n.numero_columna) : [];
    setSelected(newSelecteds);
    onSelectionChange(newSelecteds);
  };

  const handleClick = (event: React.MouseEvent<unknown>, numero_columna: number) => {
    setSelected((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(numero_columna);
      let newSelected: number[] = [];

      if (selectedIndex === -1) {
        newSelected = [...prevSelected, numero_columna];
      } else {
        newSelected = prevSelected.filter(id => id !== numero_columna);
      }

      onSelectionChange(newSelected);
      return newSelected;
    });
  };

  const handleRequestSort = (property: keyof Columna) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isSelected = (numero_columna: number) => selected.includes(numero_columna);

  const sortedData = useMemo(() => {
    console.log("order: ",order)
    console.log("orderBy: ",orderBy)
    console.log("data: ",data)

    return data.slice().sort((a, b) => {
      return (a[orderBy] < b[orderBy] ? -1 : 1) * (order === 'asc' ? 1 : -1);
    });
  }, [data, order, orderBy]);

  const paginatedData = useMemo(() => {

    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleExportToExcel = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Columnas');

    worksheet.columns = [
      { header: 'Clave Sistema', key: 'clave_sistema', width: 30 },
      { header: 'Clave Módulo', key: 'clave_modulo', width: 30 },
      { header: 'Número Columna', key: 'numero_columna', width: 20 },
      { header: 'Título', key: 'titulo', width: 50 },
    ];

    sortedData.forEach((columna) => {
      worksheet.addRow(columna);
    });

    const today = new Date();
    const date = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
    const fileName = `Columnas${date}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  }, [sortedData]);

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
            <TableCell padding="checkbox" sx={tableHeaderCellStyle}>
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all columns' }}
                sx={checkboxStyle}
              />
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>
              <TableSortLabel
                active={orderBy === 'numero_columna'}
                direction={orderBy === 'numero_columna' ? order : 'asc'}
                onClick={() => handleRequestSort('numero_columna')}
                sx={tableSortLabelStyle}
              >
                Número Columna
              </TableSortLabel>
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>
              <TableSortLabel
                active={orderBy === 'titulo'}
                direction={orderBy === 'titulo' ? order : 'asc'}
                onClick={() => handleRequestSort('titulo')}
                sx={tableSortLabelStyle}
              >
                Título
              </TableSortLabel>
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => {
            const isItemSelected = isSelected(row.numero_columna);
            const labelId = `enhanced-table-checkbox-${row.numero_columna}`;

            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.numero_columna)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={index}
                selected={isItemSelected}
                sx={getTableRowStyle(isItemSelected)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </TableCell>
                <TableCell component="th" id={labelId} scope="row">
                  {row.numero_columna}
                </TableCell>
                <TableCell>
                  {row.titulo}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateColumna(row);
                    }}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteColumna(row.numero_columna);
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
        rowsPerPageOptions={[5, 10, 50]}
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
  backgroundColor: isItemSelected ? '#8FB6C7' : '#f0f0f0',
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

export default ColumnasTable;
