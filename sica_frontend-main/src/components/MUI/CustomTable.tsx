import React, { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { DataGrid, GridColDef, GridSortModel, GridPaginationModel, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, TextField, MenuItem, Select, FormControl, InputLabel, Modal, Paper, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CustomPagination from './CustomPagination';
import DeleteConfirmation from './DeleteConfirmation';
import UserForm from '../../pages/Catalogos/componentes/UserForm';

interface User {
  id: number;
  name: string;
  role: string;
  status: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

interface CustomTableProps {
  columns: GridColDef[];
  rows: User[];
  rowCount: number;
}

const CustomTable = forwardRef(({ columns, rows, rowCount }: CustomTableProps, ref) => {
  const [tableRows, setTableRows] = useState<User[]>(rows);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ pageSize: 20, page: 0 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(false);
    setTableRows(rows);
  }, [rows]);

  const handleExport = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    worksheet.columns = columns.map(col => ({ header: col.headerName, key: col.field }));

    const currentPageRows = tableRows.slice(paginationModel.page * paginationModel.pageSize, (paginationModel.page + 1) * paginationModel.pageSize);

    currentPageRows.forEach(row => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Usuarios_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }, [columns, tableRows, paginationModel]);

  useImperativeHandle(ref, () => ({
    handleExport,
  }));

  const handleEdit = (id: number) => {
    const userToEdit = tableRows.find(user => user.id === id);
    if (userToEdit) {
      setEditUser(userToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedUserId(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUserId !== null) {
      setTableRows(tableRows.filter(row => row.id !== selectedUserId));
      setDeleteConfirmationOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = (data: FormData) => {
    const newUser: User = {
      id: tableRows.length + 1,
      name: `${data.firstName} ${data.lastName}`,
      role: data.role,
      status: data.status,
    };
    setTableRows(prevRows => [...prevRows, newUser]);
    setIsFormOpen(false);
  };

  const handleEditUser = (data: FormData) => {
    if (editUser) {
      const updatedUser = { ...editUser, ...data, name: `${data.firstName} ${data.lastName}` };
      setTableRows(prevRows => prevRows.map(user => (user.id === editUser.id ? updatedUser : user)));
      setEditUser(null);
      setIsFormOpen(false);
    }
  };

  const filteredRows = useMemo(() => {
    return tableRows.filter(row => {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [tableRows, searchTerm]);

  return (
    <Box width="90%"
     display="flex" 
     flexDirection="column" alignItems="center" justifyContent="center">
      <Box mb={2} 
      display="flex" 
      justifyContent="center" width="100%">
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: 8, flexBasis: '30%' }}
        />
        <FormControl variant="outlined" size="small" style={{ marginLeft: '10px' }}>
          <InputLabel>Total de Filas</InputLabel>
          <Select
            label="Total de Filas"
            value={paginationModel.pageSize}
            onChange={(e) => setPaginationModel(prev => ({ ...prev, pageSize: Number(e.target.value) }))}
            style={{ width: '150px' }}
          >
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={filteredRows}
          columns={[...columns, {
            field: 'actions',
            headerName: 'Acciones',
            width: 150,
            sortable: false,
            renderCell: (params) => (
              <Box>
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Editar"
                  onClick={() => handleEdit(params.id as number)}
                />
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Eliminar"
                  onClick={() => handleDelete(params.id as number)}
                />
              </Box>
            )
          }]}
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          autoHeight
          pageSizeOptions={[20, 50, 100]}
          loading={loading}
          slots={{
            pagination: CustomPagination,
            noRowsOverlay: () => <Box>No hay datos</Box>,
          }}
          slotProps={{
            pagination: {
              count: Math.ceil(rowCount / paginationModel.pageSize),
              page: paginationModel.page,
              onPageChange: (_event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
                setPaginationModel((prev) => ({ ...prev, page: value }));
              },
            }
          }}
        />
      )}
      <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <Paper style={{ padding: 20, maxWidth: 400, margin: 'auto', top: '25%', position: 'absolute', left: 0, right: 0 }}>
          <Typography variant="h6" gutterBottom>{editUser ? 'Editar Usuario' : 'Añadir Usuario'}</Typography>
          <UserForm
            defaultValues={editUser ? { firstName: editUser.name.split(' ')[0], lastName: editUser.name.split(' ')[1], role: editUser.role, status: editUser.status } : undefined}
            onSubmit={editUser ? handleEditUser : handleAddUser}
          />
        </Paper>
      </Modal>
      <DeleteConfirmation
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onConfirm={confirmDeleteUser}
      />
    </Box>
  );
});

export default CustomTable;
