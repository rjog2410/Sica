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
  var [eliminados,setEliminados]= useState<number>(0);
  const [filterValue, setFilterValue] = useState<string>('ALL');


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
    setFilterValue(modulo ? modulo : 'ALL');

  };

  const filteredModulos = modulos.filter(modulo => {
    const matchSistema = selectedSistema === 'ALL' || modulo.clave_sistema === selectedSistema;
    const matchModulo = selectedModulo === 'ALL' || modulo.clave_modulo === selectedModulo;
    return matchSistema && matchModulo;
  });

  const handleOpenModal = () => {
    setEditando(false);
    setEditingModulo(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModulo(originalObject);
  };

  const handleSaveModulo = async (newModulo: Modulo) => {
    try {
      await service.createOrUpdateModulo(newModulo, editando).then(resp =>{
        if(resp.status === 200){

          if (editando) {
            setModulos(modulos.map((modulo) =>
              modulo.clave_modulo === editingModulo.clave_modulo ? newModulo : modulo
            ));
            notify('Módulo '+resp.message+' actualizado correctamente', 'success');
          } else {
            setModulos([...modulos, newModulo]);
            notify('Módulo agregado correctamente', 'success');
          }

        }else{
          notify(resp.message, 'info');
          console.log("ocurrio un error: ",resp.message);
          setEliminados(0);    
        }
         }).catch(error =>{
        notify(error.response.data.message, 'error');
        setEliminados(0);    
        console.log("ocurrio un error",error.response.data.message);
      }) 


      
    } catch (error) {
      notify('Error al Eliminar el sistema: '+error, 'error');
    }
    handleCloseModal();
  };

  const handleEditModulo = (modulo: Modulo) => {
    setEditando(true);
    setEditingModulo(modulo);
    setIsModalOpen(true);
  };

  const handleDeleteModulo = (clave_modulo: string) => {
    console.log("handleDeleteModulo")
    setConfirmAction(() => async () => {
      try {
        await service.deleteModulo(clave_modulo).then(resp =>{
          if(resp.status === 200){
            setModulos(modulos.filter((modulo) => modulo.clave_modulo !== clave_modulo));
            notify('Módulo eliminado correctamente', 'success');
          }else{
            notify(resp.message, 'info');
            console.log("ocurrio un error al eliminar modulo: ",resp.message);
            setEliminados(0);    
          }
           }).catch(error =>{
          notify(error.response.data.message, 'error');
          setEliminados(0);    
          console.log("ocurrio un error al eliminar Modulo: ",error.response.data.message);
        }) 

    
      } catch (error) {
        notify('Error al eliminar el módulo', 'error');
      }
    });
    setConfirmOpen(true);
  };

console.log(selectedIds);
  const handleDeleteMultiple = (clave_modulos: string[]) => {
    for (var i=0; i < eliminados; i++) {
      clave_modulos.shift();
    }
    setConfirmAction(() => async () => {
      try {
       await service.deleteMultipleModulos(clave_modulos).then(resp =>{
        if(resp.status === 200){
          setModulos(modulos.filter((modulo) => !clave_modulos.includes(modulo.clave_modulo)));
          notify('Módulo eliminado correctamente', 'success');
          setEliminados(clave_modulos.length+eliminados);    
          setfilter([]);
          
          console.log("modulos eliminadoas correctamente");
        }else{
          notify(resp.message, 'info');
          console.log("ocurrio un error al eliminar modulos: ",resp.message);
          setEliminados(0);    
          setSelectedIds([]);

        }
         }).catch(error =>{
        notify(error.response.data.message, 'error');
        setEliminados(0);    
        console.log("ocurrio un error al eliminar columnas: ",error.response.data.message);
      }) 
      
      } catch (error) {
        setEliminados(0);    
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
            filterValue={filterValue}
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
