import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ColumnasTable from '../../components/base/tabla/ColumnasTable';
import ComboBox from '../../components/base/tabla/Combobox';
import { Columna, Sistema } from '../../types';
import * as serviceColumna from './selectores/serviceSelectorColumnas';
import { useNotification } from '../../providers/NotificationProvider';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import AddColumnaModal from './modales/addColumnaModal';
import * as serviceSistema from './selectores/serviceSelectorSistemas';
import * as serviceModulo from './selectores/serviceSelectorModulos';

const ColumnasPage: React.FC = () => {
  const [sistemas, setSistemas] = useState<Sistema[]>([]); 
  const [modulos, setModulos] = useState<String[]>([]);
  const [columnas, setColumnas] = useState<Columna[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string>();
  const [selectedModulo, setSelectedModulo] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingColumna, setEditingColumna] = useState<Columna | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { notify } = useNotification();
  const tableRef = useRef<any>(null);



  useEffect(() => {
    console.log("selectedSistema: ",selectedSistema);
    setColumnas([]);
    setModulos([]);
    serviceSistema.fetchSistemas().then(resp=>{
      if(!!resp && resp.length>0){
        console.log(resp);
        setSistemas(resp);
        

        serviceColumna.fetchColumnas().then(resp => {
          console.log(resp);
          setColumnas(resp); 
          notify("consultando todas las columnas", 'success');              
        }).catch(resp =>{
          console.error('Error al cargar los datos de columnas todos los sistemas', error);
        notify('Error al cargar los datos de columnas todos los sistemas', 'error');
        });
        
      }
    }).catch (error =>{
      console.error('Error al cargar los datos de sistemas:', error);
      notify('Error al cargar los datos de sistema', 'error');
    }) 
  }, []);

  const fetchDataMOduloByClaveSis = async () => {
    try {
      setColumnas([]);
      let dataMod= null;
      if(!!selectedSistema && selectedSistema !== 'ALL'){
        dataMod=  await serviceModulo.fetchModuloByClave(selectedSistema);
      }else{
        dataMod=  await serviceModulo.fetchModulos();
      }
      
      if(!!dataMod && dataMod.length>0){
        console.log("respuesta modulos para sistema {}: {}",selectedSistema,dataMod);
        setModulos(['ALL', ...Array.from(new Set(dataMod.map(obj => obj?.mod_clave)))]);
        setSelectedModulo('');
      }else{
        setModulos(['ALL']);
        setSelectedModulo('ALL');
      }
      serviceColumna.fetchColumnaByCveSistema(selectedSistema).then(resp =>{
        console.log(resp);
        setColumnas(resp);
        notify("consultando columnas por sistema: "+selectedSistema, 'success');
      }).catch(resp=>{
        console.error('Error al cargar los datos de columnas para el sistema: '+selectedSistema, error);
        notify('Error al cargar los datos de columnas para el sistema: '+selectedSistema , 'error');
      });
      
    } catch (error) {
      console.error('Error al cargar los datos de modulos para el sistema: '+selectedSistema, error);
      notify('Error al cargar los datos de modulos para el sistema: '+selectedSistema, 'error');
    }
  };

  useEffect(() => {
    setColumnas([]);
    setModulos([]);
    if (!!selectedSistema && selectedSistema !== 'ALL') {
      fetchDataMOduloByClaveSis();
      
    } else {
      console.log("consultando all columnas");
  
          serviceColumna.fetchColumnas().then(resp => {
            console.log(resp);
            setColumnas(resp);    
            notify("consultando todas las columnas", 'success');             
          }).catch(resp =>{
            console.error('Error al cargar los datos de columnas todos los sistemas', error);
            notify('Error al cargar los datos de columnas todos los sistemas', 'error');
          });
        
    }
  }, [selectedSistema]);

  useEffect(() => {
    setColumnas([]);
      if(!!selectedModulo && selectedModulo === 'ALL'){
        console.log("consultando columnas por sistema: "+selectedSistema);
       if(!!selectedSistema && selectedSistema ==='ALL'){
        serviceColumna.fetchColumnas().then(resp => {
          console.log(resp);
          setColumnas(resp); 
          notify("consultando todas las columnas", 'success');              
        }).catch(resp =>{
          console.error('Error al cargar los datos de columnas todos los sistemas', error);
          notify('Error al cargar los datos de columnas todos los sistemas', 'error');
        });
       }else{
          if(!!selectedSistema){
            serviceColumna.fetchColumnaByCveSistema(selectedSistema).then(resp =>{
              console.log(resp);
              setColumnas(resp);
              notify("consultando columnas por sistema: "+selectedSistema, 'success');
            }).catch(resp=>{
              console.error('Error al cargar los datos de columnas para el sistema: '+selectedSistema, error);
              notify('Error al cargar los datos de columnas para el sistema: '+selectedSistema , 'error');
            });
          }
        }
      }else{
        if(!!selectedModulo && !!selectedSistema){
          console.log("consultando columnas por sistema: "+selectedSistema +' y modulo: '+selectedModulo);
          serviceColumna.fetchColumnasBySisCveAndModCve(selectedSistema, selectedModulo).then(resp =>{
            console.log(resp);
            setColumnas(resp);
            notify("consultando columnas por sistema: "+selectedSistema +' y modulo: '+selectedModulo, 'success');
          }).catch(resp=>{
            console.error('Error al cargar los datos de columnas para el sistema: '+selectedSistema +' y modulo: '+selectedModulo, error);
            notify('Error al cargar los datos de columnas para el sistema: '+selectedSistema +' y modulo: '+selectedModulo, 'error');
          });
        }
      }
  }, [selectedModulo]);

  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    
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
      if (editingColumna!=null) {

        console.log("editando col: ",newColumna);
        serviceColumna.createOrUpdateColumna(newColumna, true).then(resp =>{
          console.log("respuesta de editando: ",resp);
          if(resp?.data?.status == 200){
            setColumnas(columnas.map((columna) =>
              columna.numero_columna === editingColumna.numero_columna ? newColumna : columna
            ));
            notify('Columna actualizada correctamente', 'success');
          }else{
            notify( resp?.data?.message, 'info');
          }
         

        }).catch(resp =>{
          console.log("respuesta error de editando: ",resp?.data?.message);
          notify('No fue posible actualizar la columna', 'error');
        });
        
      } else {
        console.log("nueva col: ");
        serviceColumna.createOrUpdateColumna(newColumna).then(resp => {
          console.log("respuesta agregar columna: ",resp);
          
          if(resp?.data?.status == 200){
            setColumnas([...columnas, newColumna]);
            notify(resp?.data?.message, 'success');
          }else{
            notify( resp?.data?.message, 'info');
          }
          
        }).catch(resp => {
          console.log("error agregar columna: ",resp?.data?.message);
          notify('No fue posible agregar la columna', 'error');
        });
       
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
        await serviceColumna.deleteColumna(columnaToDelete);  // Aquí pasamos el objeto Columna completo
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
        await serviceColumna.deleteMultipleColumnas(columnasToDelete); 
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
          options={['ALL', ...Array.from(new Set(sistemas.map(sistema => sistema.sis_clave)))]}
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
        data={columnas}
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
