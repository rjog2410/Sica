import { useCallback } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNotification } from '../../providers/NotificationProvider';
import { GenericData, ColumnConfig, Modulo } from '../../types';
import { allColumns } from './modulosData'; // Ajusta la ruta según sea necesario

export const useModulosHandlers = (
  data: GenericData[],
  setData: (data: GenericData[]) => void,
  setFilteredData: (data: GenericData[]) => void,
  setVisibleColumns: (columns: ColumnConfig[]) => void
) => {
  const { notify } = useNotification();

  const handleCreateOrUpdate = useCallback(async (item: GenericData) => {
    try {
      const updatedData = data.map(d => d.mod_clave === item.mod_clave ? item : d);
      setData(updatedData);
      notify(`Módulo actualizado exitosamente.`, 'success');
    } catch (error) {
      notify(`Error guardando módulo: ${(error as Error).message}`, 'error');
    }
  }, [data, notify, setData]);

  const handleDelete = useCallback(async (id: string | number) => {
    try {
      const updatedData = data.filter(d => d.mod_clave !== id);
      setData(updatedData);
      notify(`Módulo eliminado exitosamente.`, 'success');
    } catch (error) {
      notify(`Error eliminando módulo: ${(error as Error).message}`, 'error');
    }
  }, [data, notify, setData]);

  const handleSelect = (selected: Modulo | null) => {
    if (selected && selected.mod_clave === 'ALL') {
      setFilteredData(data);
    } else if (selected) {
      setFilteredData(data.filter(d => d.mod_clave === selected.mod_clave));
    } else {
      setFilteredData(data);
    }
  };

  const handleColumnChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const selectedFields = typeof value === 'string' ? value.split(',') : value;
    const selectedColumns = allColumns.filter(col => selectedFields.includes(col.field));
    setVisibleColumns(selectedColumns);
  };

  return {
    handleCreateOrUpdate,
    handleDelete,
    handleSelect,
    handleColumnChange,
  };
};
