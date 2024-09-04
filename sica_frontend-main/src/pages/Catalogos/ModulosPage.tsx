import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { useNotification } from '../../providers/NotificationProvider';
import BodyHeader from '../../components/base/BodyHeader';
import ModulosTable from '../../components/base/tabla/ModulosTable';
import * as service from './selectores/serviceSelectorModulos'; // Usamos serviceSelector para mocks y API
import { Modulo } from '../../types';
import ComboBox from '../../components/base/tabla/Combobox';
import AddModuloModal from './modales/AddModuloModal';
import ConfirmDialog from '../../components/base/ConfirmDialog';

const ModulosPage: React.FC = () => {
  const originalObject = {
    clave_sistema: '',
    clave_modulo: '',
    nombre_modulo: '',
    fecha_carga: null,
    num_registros: null,
    fecha_informacion: null,
    tipo_transaccion: null, // Se inicia como null
    status: null,           // Se inicia como null
    agrupacion_reportes: null
  }
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string | null>('ALL');
  const [secondFilterOptions, setSecondFilterOptions] = useState<string[]>([]);
  const [selectedModulo, setSelectedModulo] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const tableRef = useRef<any>(null);
  const [editingModulo, setEditingModulo] = useState<Modulo | null>(originalObject);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editando, setEditando] = useState<boolean>(false);


  const { notify } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await service.fetchModulos();
        setModulos(data);
        notify('Módulos cargados', 'info');
      } catch (error) {
        notify('Error al cargar los datos de módulos', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [notify]);

  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    if (sistema && sistema !== 'ALL') {
      const filteredModules = modulos.filter(m => m.clave_sistema === sistema);
      const newOptions = ['ALL', ...new Set(filteredModules.map(m => m.clave_modulo))];
      setSecondFilterOptions(newOptions);
      setSelectedModulo('ALL');
    } else {
      setSecondFilterOptions([]);
      setSelectedModulo('ALL');
    }
  };

  const handleModuloSelect = (modulo: string | null) => {
    setSelectedModulo(modulo || 'ALL');
  };

  const filteredModulos = modulos.filter(modulo => {
    const matchSistema = selectedSistema === 'ALL' || modulo.clave_sistema === selectedSistema;
    const matchModulo = selectedModulo === 'ALL' || modulo.clave_modulo === selectedModulo;
    return matchSistema && matchModulo;
  });

  const handleOpenModal = () => {
    setEditingModulo(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModulo(originalObject);

  };

  const handleSaveModulo = async (newModulo: Modulo) => {
    try {
      const responseMessage = await service.createOrUpdateModulo(newModulo, editando);

      if (editando) {
        // Actualizar el sistema en el estado local
        setModulos(modulos.map((modulo) =>
          modulo.clave_modulo === editingModulo.clave_modulo ? newModulo : modulo
        ));
        notify('Módulo '+responseMessage.message+' actualizado correctamente', 'success');
      }else if(responseMessage.status=='400'){
        notify(responseMessage.message,'warning');
      } else {
        setModulos([...modulos, newModulo]);
        notify('Módulo agregado correctamente', 'success');
      }
    } catch (error) {
      console.log(error)
      notify('Error al Eliminar el sistema: '+error.response.data.message, 'error');
    }
    handleCloseModal();
  };

  const handleEditModulo = (modulo: Modulo) => {
    setEditando(true);
    setEditingModulo(modulo);
    setIsModalOpen(true);
  };

  const handleDeleteModulo = (clave_modulo: string) => {
    setConfirmAction(() => async () => {
      try {
        await service.deleteModulo(clave_modulo);
        setModulos(modulos.filter((modulo) => modulo.clave_modulo !== clave_modulo));
        notify('Módulo eliminado correctamente', 'success');
      } catch (error) {
        notify('Error al eliminar el módulo', 'error');
      }
    });
    setConfirmOpen(true);
  };

  const handleDeleteMultiple = (clave_modulos: string[]) => {
    setConfirmAction(() => async () => {
      try {
        await service.deleteMultipleModulos(clave_modulos);
        setModulos(modulos.filter((modulo) => !clave_modulos.includes(modulo.clave_modulo)));
        notify('Módulos eliminados correctamente', 'success');
      } catch (error) {
        notify('Error al eliminar los módulos', 'error');
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
        headerRoute="Catálogos / Módulos"
        TitlePage="Módulos"
        tooltipProps={{ title: "Información sobre la Gestión de Módulos" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      {loading ? (
        <div>Cargando datos...</div>
      ) : (
        <>
          <Box mb={2}>
            <ComboBox
              options={['ALL', ...Array.from(new Set(modulos.map(modulo => modulo.clave_sistema)))]}
              onSelect={handleSistemaSelect}
              label="Seleccione un Sistema"
              getOptionLabel={(option: string) => option}
            />
          </Box>
          <Box mb={2}>
            <ComboBox
              options={secondFilterOptions}
              onSelect={handleModuloSelect}
              label="Filtrar por Clave de Módulo"
              getOptionLabel={(option: string) => option}
              disabled={selectedSistema === 'ALL' || secondFilterOptions.length === 0}
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
          <ModulosTable
            ref={tableRef}
            data={filteredModulos}
            onSelectionChange={setSelectedIds}
            onUpdateModulo={handleEditModulo}
            onDeleteModulo={handleDeleteModulo}
          />
          <AddModuloModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveModulo}
            initialData={editingModulo}
          />
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        content="¿Estás seguro de que deseas eliminar este módulo? Esta acción no se puede deshacer."
        onClose={(confirmed) => {
          setConfirmOpen(false);
          if (confirmed) confirmAction();
        }}
      />
    </Box>
  );
};

export default ModulosPage;
