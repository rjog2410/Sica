import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ColumnasTable from '../../components/base/tabla/ColumnasTable';
import ComboBox from '../../components/base/tabla/Combobox';
import { Columna, Modulo, Sistema } from '../../types';
import * as service from './selectores/serviceSelectorColumnas';
import { useNotification } from '../../providers/NotificationProvider';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import AddColumnaModal from './modales/addColumnaModal';
import * as serviceSistema from './selectores/serviceSelectorSistemas';
import * as serviceModulo from './selectores/serviceSelectorModulos';

const ColumnasPage: React.FC = () => {
  const [sistemas, setSistemas] = useState<Sistema[]>([]); 
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [columnas, setColumnas] = useState<Columna[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string | null>('ALL');
  const [selectedModulo, setSelectedModulo] = useState<string | null>('ALL');
  const [filteredColumnas, setFilteredColumnas] = useState<Columna[]>([]);
 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingColumna, setEditingColumna] = useState<Columna | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { notify } = useNotification();
  const tableRef = useRef<any>(null);

  const fetchData = async () => {
    try {
    const dataSist= await serviceSistema.fetchSistemas();
    console.log(dataSist);
    setSistemas(dataSist);
    const dataMod= await serviceModulo.fetchModulos();
    console.log(dataMod);
    setModulos(dataMod);
   
    } catch (error) {
      console.error('Error al cargar los datos de columnas:', error);
      notify('Error al cargar los datos de columnas', 'error');
    }
  };

  useEffect(() => {
     fetchData().then(resp =>{
      service.fetchColumnas().then(resp =>{
        setColumnas(resp);
      })
      
     })
  }, [notify]);

  useEffect(() => {
    if (selectedSistema && selectedSistema !== 'ALL') {
      const modulosFiltrados = columnas
        .filter(columna => columna.clave_sistema === selectedSistema)
        .map(columna => columna.clave_modulo);
      setModulos(['ALL', ...Array.from(new Set(modulosFiltrados))]);
    } else {
      setModulos(['ALL']);
    }
  }, [selectedSistema, columnas]);

  useEffect(() => {
    setFilteredColumnas(
      columnas.filter(columna => {
        const matchSistema = selectedSistema === 'ALL' || columna.clave_sistema === selectedSistema;
        const matchModulo = selectedModulo === 'ALL' || columna.clave_modulo === selectedModulo;
        return matchSistema && matchModulo;
      })
    );
  }, [selectedSistema, selectedModulo, columnas]);

  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    setSelectedModulo('ALL');
  };

  const handleModuloSelect = (modulo: string | null) => {
    setSelectedModulo(modulo);
  };

  const handleOpenModal = () => {
    setEditingColumna(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveColumna = async (newColumna: Columna) => {
    try {
      if (editingColumna) {
        await service.createOrUpdateColumna(newColumna, true);
        setColumnas(columnas.map((columna) =>
          columna.numero_columna === editingColumna.numero_columna ? newColumna : columna
        ));
        notify('Columna actualizada correctamente', 'success');
      } else {
        await service.createOrUpdateColumna(newColumna);
        setColumnas([...columnas, newColumna]);
        notify('Columna agregada correctamente', 'success');
      }
    } catch (error) {
      notify('Error al guardar la columna', 'error');
    }
    handleCloseModal();
  };

  const handleEditColumna = (columna: Columna) => {
    setEditingColumna(columna);
    setIsModalOpen(true);
  };

  const handleDeleteColumna = (numero_columna: number) => {
    const columnaToDelete = columnas.find(columna => columna.numero_columna === numero_columna);
  
    if (!columnaToDelete) {
      notify('Columna no encontrada', 'error');
      return;
    }
  
    setConfirmAction(() => async () => {
      try {
        await service.deleteColumna(columnaToDelete);  // Aquí pasamos el objeto Columna completo
        setColumnas(columnas.filter(columna => columna.numero_columna !== numero_columna));
        notify('Columna eliminada correctamente', 'success');
      } catch (error) {
        notify('Error al eliminar la columna', 'error');
      }
    });
    setConfirmOpen(true);
  };

  const handleDeleteMultiple = (numero_columnas: number[]) => {
    const columnasToDelete = columnas.filter(columna => 
      numero_columnas.includes(columna.numero_columna)
    );
  
    setConfirmAction(() => async () => {
      try {
        await service.deleteMultipleColumnas(columnasToDelete); // Aquí pasamos las columnas completas
        setColumnas(columnas.filter(columna => 
          !numero_columnas.includes(columna.numero_columna)
        ));
        notify('Columnas eliminadas correctamente', 'success');
      } catch (error) {
        notify('Error al eliminar las columnas', 'error');
      }
    });
    setConfirmOpen(true);
  };

  const handleExportExcel = () => {
    if (tableRef.current) {
      try {
        const exportResult = tableRef.current.exportToExcel();
        if (exportResult instanceof Promise) {
          exportResult.catch((error) => {
            console.error('Error al exportar a Excel:', error);
          });
        }
      } catch (error) {
        console.error('Error al exportar a Excel:', error);
      }
    }
  };

  return (
    <Box>
      <BodyHeader
        headerRoute="Catálogos / Columnas"
        TitlePage="Columnas"
        tooltipProps={{ title: "Información sobre la Gestión de Columnas" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Box mb={2}>
        <ComboBox
          options={['ALL', ...Array.from(new Set(columnas.map(columna => columna.clave_sistema)))]}
          onSelect={handleSistemaSelect}
          label="Seleccione un Sistema"
          getOptionLabel={(option: string) => option}
        />
      </Box>
      <Box mb={2}>
        <ComboBox
          options={modulos}
          onSelect={handleModuloSelect}
          label="Seleccione un Módulo"
          getOptionLabel={(option: string) => option}
          disabled={selectedSistema === 'ALL'}
        />
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteMultiple(selectedIds)}
              sx={{ mr: 1 }}
            >
              Eliminar Selección
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mr: 1 }}>
            Agregar
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#28a745', '&:hover': { backgroundColor: '#218838' } }}
            onClick={handleExportExcel}
          >
            Exportar Excel
          </Button>
        </Box>
      </Box>
      <ColumnasTable
        ref={tableRef}
        data={filteredColumnas}
        onSelectionChange={setSelectedIds}
        onUpdateColumna={handleEditColumna}
        onDeleteColumna={handleDeleteColumna}
      />
      <AddColumnaModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveColumna}
        initialData={editingColumna}       
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        content="¿Estás seguro de que deseas eliminar esta columna? Esta acción no se puede deshacer."
        onClose={(confirmed) => {
          setConfirmOpen(false);
          if (confirmed) confirmAction();
        }}
      />
    </Box>
  );
};

export default ColumnasPage;
