import React, { forwardRef } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridToolbar, GridRowSelectionModel, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const esESLocaleText = {
  noRowsLabel: 'No hay filas',
  errorOverlayDefaultLabel: 'Ha ocurrido un error.',
  // Añade más traducciones aquí
};

interface GenericTableProps<T> {
  columns: GridColDef[];
  data: GridRowsProp;
  idField: keyof T;
  onSelectionChange: (selectedIds: (string | number)[]) => void;
  onUpdate?: (item: T) => void;
  onDelete?: (id: string | number) => void;
  styles?: React.CSSProperties;
  showSearchBar?: boolean;
  showExportButton?: boolean;
}

const GenericTable = forwardRef<any, GenericTableProps<any>>(({
  columns, data, idField, onSelectionChange, onUpdate, onDelete, styles = {},
  showSearchBar = true, showExportButton = true
}, ref) => {
  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    onSelectionChange(rowSelectionModel as (string | number)[]);
  };

  const renderActions = (params: GridRenderCellParams) => (
    <Box>
      {onUpdate && (
        <IconButton onClick={() => onUpdate(params.row as any)}>
          <EditIcon />
        </IconButton>
      )}
      {onDelete && (
        <IconButton onClick={() => onDelete(params.row[idField] as string | number)}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );

  const enhancedColumns = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      renderCell: renderActions,
      width: 150,
    },
  ];

  return (
    <Box sx={{ width: '100%', ...styles }}>
      <DataGrid
        rows={data}
        columns={enhancedColumns}
        getRowId={(row) => row[idField] as string | number}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionChange}
        components={{
          Toolbar: showSearchBar || showExportButton ? GridToolbar : null
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: showSearchBar,
            quickFilterProps: { debounceMs: 500 }
          },
        }}
        autoHeight
        ref={ref}
        localeText={esESLocaleText}
      />
    </Box>
  );
});

export default GenericTable;
