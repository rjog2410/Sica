import React, { forwardRef, useImperativeHandle, useState, useMemo, useCallback } from 'react';
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
import { Sistema } from '../../../types';

interface SistemasTableProps {
  data: Sistema[];
  onSelectionChange: (selectedIds: string[]) => void;
  onUpdateSistema: (sistema: Sistema) => void;
  onDeleteSistema: (sis_clave: string) => void;
  filterValue: string;
}

type Order = 'asc' | 'desc';

const SistemasTable = forwardRef(({
  data,
  onSelectionChange,
  onUpdateSistema,
  onDeleteSistema,
  filterValue,
}: SistemasTableProps, ref) => {

  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Sistema>('sis_clave');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useImperativeHandle(ref, () => ({
    exportToExcel: handleExportToExcel,
  }));

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.sis_clave);
      setSelected(newSelecteds);
      onSelectionChange(newSelecteds);
      return;
    }
    setSelected([]);
    onSelectionChange([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, sis_clave: string) => {
    const selectedIndex = selected.indexOf(sis_clave);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, sis_clave);
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

  const handleRequestSort = (property: keyof Sistema) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isSelected = (sis_clave: string) => selected.indexOf(sis_clave) !== -1;

  const filteredData = useMemo(() => {
    setSelected([]);
    onSelectionChange([]);
    return filterValue === 'ALL'
      ? data
      : data.filter((sistema) => sistema.sis_clave.includes(filterValue));
  }, [data, filterValue]);

  const sortedData = useMemo(() => {
    return filteredData.slice().sort((a, b) => {
      if (orderBy === 'sis_clave' || orderBy === 'sis_nombre') {
        return (a[orderBy] < b[orderBy] ? -1 : 1) * (order === 'asc' ? 1 : -1);
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleExportToExcel = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sistemas');

    worksheet.columns = [
      { header: 'Clave del Sistema', key: 'sis_clave', width: 30 },
      { header: 'Nombre del Sistema', key: 'sis_nombre', width: 50 },
    ];

    sortedData.forEach((sistema) => {
      worksheet.addRow(sistema);
    });

    const today = new Date();
    const date = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
    const fileName = `Sistemas${date}.xlsx`;

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
                inputProps={{ 'aria-label': 'select all sistemas' }}
                sx={checkboxStyle}
              />
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>
              <TableSortLabel
                active={orderBy === 'sis_clave'}
                direction={orderBy === 'sis_clave' ? order : 'asc'}
                onClick={() => handleRequestSort('sis_clave')}
                sx={tableSortLabelStyle}
              >
                Clave del Sistema
              </TableSortLabel>
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>
              <TableSortLabel
                active={orderBy === 'sis_nombre'}
                direction={orderBy === 'sis_nombre' ? order : 'asc'}
                onClick={() => handleRequestSort('sis_nombre')}
                sx={tableSortLabelStyle}
              >
                Nombre del Sistema
              </TableSortLabel>
            </TableCell>
            <TableCell sx={tableHeaderCellStyle}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => {
            const isItemSelected = isSelected(row.sis_clave);
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.sis_clave)}
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
                <TableCell component="th" id={labelId} scope="row" sx={{ paddingLeft: 3 }}>
                  {row.sis_clave}
                </TableCell>
                <TableCell sx={{ paddingLeft: 3 }}>
                  {row.sis_nombre}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateSistema(row);
                    }}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSistema(row.sis_clave);
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


const tableHeaderCellStyle = {
  backgroundColor: '#013A63',
  color: '#ffffff',
  fontWeight: 'bold',
  '&:hover': { backgroundColor: '#013052' },
};

const checkboxStyle = {
  color: '#ffffff',
  '&.Mui-checked': { color: '#D32F2F' },
  '&.MuiCheckbox-indeterminate': { color: '#ff9800' },
  '&:hover': { color: '#D32F2F' },
  '&.Mui-checked:hover': { color: '#D32F2F' },
  '&.MuiCheckbox-indeterminate:hover': { color: '#ffb74d' },
};

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

export default SistemasTable;
