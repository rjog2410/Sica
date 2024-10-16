import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ColumnasTable from '../../components/base/tabla/ColumnasTable';
import { Columna, Sistema } from '../../types';
import * as serviceColumna from './selectores/serviceSelectorColumnas';
import { useNotification } from '../../providers/NotificationProvider';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import AddColumnaModal from './modales/addColumnaModal';
import * as serviceSistema from './selectores/serviceSelectorSistemas';
import * as serviceModulo from './selectores/serviceSelectorModulos';
import useAuthStore from '../../store/authStore'; //para permisos
import { useNavigate } from 'react-router-dom'; //para permisos
import * as serviceInfo from '@/pages/CommonServices/commonService'
const ColumnasPage: React.FC = () => {
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [modulos, setModulos] = useState<String[]>([]);
  const [columnas, setColumnas] = useState<Columna[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string>('TODOS');
  const [selectedModulo, setSelectedModulo] = useState<string>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingColumna, setEditingColumna] = useState<Columna | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { notify } = useNotification();
  const tableRef = useRef<any>(null);
  //ajuste permisos start
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore(); 
  const requiredPermission = '/sica/catalogos/columna';
  const [infoData, setInfoData] = useState<string>(''); 
  const { token } = useAuthStore();
    useEffect(() => {
      if (!hasPermission(requiredPermission)) {
        notify('No tienes permisos para acceder a esta página', 'error');
        navigate('/');
      }
    }, [hasPermission, navigate, notify]);
  
    //ajustes permisos end

  useEffect(() => {
    // console.log("selectedSistema: ", selectedSistema);
    setColumnas([]);
    setModulos([]);
    serviceSistema.fetchSistemas(token).then(resp => {
      if (!!resp && resp.length > 0) {
        setSistemas(resp);

      }
    }).catch(error => {
      console.error('Error al cargar los datos de sistemas:', error);
      notify('Error al cargar los datos de sistemas', 'error');
    })
  }, []);

  useEffect(() => {
    const getInfo = async () =>
    { 
      try {
        const data = await serviceInfo.getInfoPantalla(requiredPermission,token);
        setInfoData(data);
      } catch (error) {
        setInfoData('Sin Información.');
      }
    };
    getInfo();
  }, []);

  const fetchDataMOduloByClaveSis = async () => {
    try {
      setColumnas([]);
      let dataMod = null;
      if (!!selectedSistema && selectedSistema !== 'TODOS') {
        dataMod = await serviceModulo.fetchModuloByClave(selectedSistema,token);
      } else {
        dataMod = await serviceModulo.fetchModulos(token);
      }

      if (!!dataMod && dataMod.length > 0) {
        console.log("respuesta modulos para sistema {}: {}", selectedSistema, dataMod);
        setModulos(['TODOS', ...Array.from(new Set(dataMod.map(obj => obj?.mod_clave)))]);
        setSelectedModulo('TODOS');

        serviceColumna.fetchColumnaByCveSistema(selectedSistema,token).then(resp => {
          console.log(resp);
          setColumnas(resp);
          notify("consultando columnas por sistema: " + selectedSistema, 'success');
        }).catch(error => {
          console.error('Error al cargar los datos de columnas para el sistema: ' + selectedSistema, error);
          notify('Error al cargar los datos de columnas para el sistema: ' + selectedSistema, 'error');
        });

      } else {
        setModulos(['TODOS']);
        setSelectedModulo('TODOS');
      }




    } catch (error) {
      console.error('Error al cargar los datos de modulos para el sistema: ' + selectedSistema, error);
      notify('Error al cargar los datos de modulos para el sistema: ' + selectedSistema, 'error');
    }
  };

  useEffect(() => {
    setColumnas([]);
    setModulos([]);
    if (!!selectedSistema && selectedSistema !== 'TODOS') {
      fetchDataMOduloByClaveSis();

    } else {
      console.log("consultando all columnas");
      serviceColumna.fetchColumnas(token).then(resp => {
        setColumnas(resp);
        setSelectedModulo('TODOS');
        notify("consultando todas las columnas", 'success');
      }).catch(resp => {
        console.error('Error al cargar los datos de columnas todos los sistemas', error);
        notify('Error al cargar los datos de columnas todos los sistemas', 'error');
      });

    }
  }, [selectedSistema]);

  const consultaCols = () => {
    setColumnas([]);
    if (!!selectedSistema && selectedSistema !== 'TODOS') {
      console.log("consultando columnas por sistema: " + selectedSistema);

      console.log("consultando columnas por sistema: " + selectedSistema + ' y modulo: ' + selectedModulo);
      serviceColumna.fetchColumnasBySisCveAndModCve(selectedSistema, selectedModulo,token).then(resp => {
        console.log(resp);
        setColumnas(resp);
        notify("consultando columnas por sistema: " + selectedSistema + ' y modulo: ' + selectedModulo, 'success');
      }).catch(resp => {
        console.error('Error al cargar los datos de columnas para el sistema: ' + selectedSistema + ' y modulo: ' + selectedModulo, resp);
        notify('Error al cargar los datos de columnas para el sistema: ' + selectedSistema + ' y modulo: ' + selectedModulo, 'error');
      });

    }
  };

  useEffect(() => {

    consultaCols();


  }, [selectedModulo]);


  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    setSelectedModulo('TODOS');

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
      if (editingColumna != null) {

        console.log("editando col: ", newColumna);
        serviceColumna.createOrUpdateColumna(newColumna, true,token).then(resp => {
          if (resp?.data?.status == 200) {
            setColumnas(columnas.map((columna) =>
              (columna.numero_columna === editingColumna.numero_columna && columna.clave_sistema === editingColumna.clave_sistema && columna.clave_modulo === editingColumna.clave_modulo) ? newColumna : columna
            ));
            notify('Columna actualizada correctamente', 'success');
          } else {
            notify(resp?.data?.message, 'info');
          }


        }).catch(resp => {
          console.log("respuesta error de editando: ", resp?.data?.message);
          notify('No fue posible actualizar la columna', 'error');
        });

      } else {
        // console.log("nueva col: ");
        serviceColumna.createOrUpdateColumna(newColumna,false,token).then(resp => {
          // console.log("respuesta agregar columna: ",resp);

          if (resp?.data?.status == 200) {
            setColumnas([...columnas, newColumna]);
            notify("Columna creada exitosamente.", 'success');
          } else {
            notify(resp?.data?.message, 'info');
          }

        }).catch(resp => {
          console.log("error agregar columna: ", resp?.data?.message);
          notify('No fue posible agregar la columna', 'error');
        });

      }
    } catch (error) {
      notify('No es posible guardar el registro.', 'error');
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
        await serviceColumna.deleteColumna(columnaToDelete,token);  // Aquí pasamos el objeto Columna completo
        setColumnas(columnas.filter(columna => columna.numero_columna !== numero_columna));
        notify('Columna eliminada correctamente', 'success');
      } catch (error) {
        notify('No es posible eliminar el registro.', 'error');
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
        // console.log("columnas a eliminar: ",columnasToDelete);
        await serviceColumna.deleteMultipleColumnas(columnasToDelete,token).then(resp => {
          if (resp.status === 200) {
            consultaCols();
            notify(resp.message, 'success');
            // console.log("columnas eliminadoas correctamente");
          } else {
            notify(resp.message, 'info');
            // console.log("ocurrio un error al eliminar columnas: ",resp.message);
          }

        }).catch(error => {
          notify(error.response.data.message, 'error');
          // console.log("ocurrio un error al eliminar columnas: ",error.response.data.message);
        })

      } catch (error) {
        notify('No es posible eliminar los registros.', 'error');
        // console.log("columnas eliminadoas correctamente");
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
        tooltipProps={{ title: infoData }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Box mb={2}>
        <Autocomplete
          options={['TODOS', ...Array.from(new Set(sistemas.map(sistema => sistema.sis_clave)))]}
          onChange={(_event, value) => handleSistemaSelect(value)}
          value={selectedSistema}
          renderInput={(params) => <TextField {...params} label={selectedSistema} variant="outlined" />} // Aplicamos la propiedad sx a TextField
        />
      </Box>
      <Box mb={2}>
        <Autocomplete
          options={modulos}
          onChange={(_event, value) => handleModuloSelect(value)}
          disabled={selectedSistema === 'TODOS'}
          value={selectedModulo}
          renderInput={(params) => <TextField {...params} label={selectedModulo} variant="outlined" />} // Aplicamos la propiedad sx a TextField
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