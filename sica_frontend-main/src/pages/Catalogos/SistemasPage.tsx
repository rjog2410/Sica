import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { useNotification } from '../../providers/NotificationProvider';
import BodyHeader from '../../components/base/BodyHeader';
import SistemasTable from '../../components/base/tabla/SistemasTable';
import { Sistema } from '../../types';
import * as service from './selectores/serviceSelectorSistemas'; // Usamos serviceSelector para mocks y API
import AddSistemaModal from './modales/AddSistemaModal';
import ComboBox from '../../components/base/tabla/Combobox';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import useAuthStore from '../../store/authStore'; //para permisos
import { useNavigate } from 'react-router-dom'; //para permisos
import * as serviceInfo from '@/pages/CommonServices/commonService';


const SistemasPage: React.FC = () => {
  const originalObject = { sis_clave: '', sis_nombre: '' }
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [, setSelectedSistema] = useState<Sistema | null>(null);
  const [filterValue, setFilterValue] = useState<string>('TODOS');
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const tableRef = useRef<any>(null);
  const [editingSistema, setEditingSistema] = useState<Sistema | null>(originalObject);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [infoData, setInfoData] = useState<string>(''); 

  const { notify } = useNotification();
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  const requiredPermission = '/sica/catalogos/sistemas';
  const { token } = useAuthStore();
  useEffect(() => {
    if (!hasPermission(requiredPermission)) {
      notify('No tienes permisos para acceder a esta página', 'error');
      navigate('/');
    }
  }, [hasPermission, navigate, notify]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sistemasData, data] = await Promise.all([
          service.fetchSistemas(token),
          serviceInfo.getInfoPantalla(requiredPermission, token)
        ]);

        setSistemas(sistemasData);
        setInfoData(data);

        notify('Sistemas cargados', 'info');
      } catch (error) {
        notify('Error al cargar los datos', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [notify]);

//   useEffect(() => {
//     const getInfo = async () => {
//         try {
//             const data = await serviceInfo.getInfoPantalla(requiredPermission, token);
//             setInfoData(data);

//         } catch (error) {
//             notify('Error al cargar los datos de la pantalla', 'error');
//         }
//     };

//     getInfo();
// }, [notify]);

  const handleSistemaSelect = (sistema: Sistema | null) => {
    setSelectedSistema(sistema);
    setFilterValue(sistema ? sistema.sis_clave : 'TODOS');
  };

  const handleOpenModal = () => {
    setEditando(false);
    setEditingSistema(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSistema(originalObject);
  };

  const handleSaveSistema = async (newSistema: Sistema) => {
    try {
      // Llamada al servicio para guardar o actualizar el sistema
      const responseMessage = await service.createOrUpdateSistema(newSistema, editando,token);
      if (editando) {
        // Actualizar el sistema en el estado local
        setSistemas(sistemas.map((sistema) =>
          sistema.sis_clave === editingSistema.sis_clave ? newSistema : sistema
        ));
        notify('Sistema actualizado correctamente', 'success');
      } else if (responseMessage.status == '400') {
        notify(responseMessage.message, 'warning');
      } else {
        setSistemas([...sistemas, newSistema]);
        notify('Sistema agregado correctamente', 'success');
      }
    } catch (error) {
      notify('Error al guardar el registro.', 'error');
    }
    setEditingSistema(null);

    handleCloseModal();
  };


  const handleEditSistema = (sistema: Sistema) => {
    setEditando(true);
    setEditingSistema(sistema);
    setIsModalOpen(true);
  };

  const handleDeleteSistema = (sis_clave: string) => {
    console.log("handleDeleteSistema")
    setConfirmAction(() => async () => {
      try {
        const responseMessage = await service.deleteSistema(sis_clave,token);
        console.log(responseMessage);
        if (responseMessage?.status == '200') {
          setSistemas(sistemas.filter((sistema) => sistema.sis_clave !== sis_clave));

          notify('Sistema eliminado correctamente', 'success');
        } else {
          notify(responseMessage.message, 'warning');
        }
      } catch (error) {
        notify('No es posible eliminar el registro.', 'error');
      }
    });
    setConfirmOpen(true);
  };

  const handleDeleteMultiple = (sis_claves: string[]) => {
    console.log("DeleteMultiple")
    console.log(sis_claves)
    setConfirmAction(() => async () => {
      try {
        const responseMessage = await service.deleteMultipleSistemas(sis_claves,token);
        console.log("-----" + responseMessage?.status);
        if (responseMessage?.status == '200') {
          setSistemas(sistemas.filter((sistema) => !sis_claves.includes(sistema.sis_clave)));
          setSelectedIds([]);
          notify('Sistemas eliminados correctamente', 'success');
        } else {
          notify(responseMessage.message, 'warning');
        }
      } catch (error) {
        notify('No es posible eliminar los registros.', 'error');
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
        headerRoute="Catálogos / Sistemas"
        TitlePage="Sistemas"
        tooltipProps={{ title: infoData }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      {loading ? (
        <div>Cargando datos...</div>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} >
            <Box sx={{ width: 250 }}>
              <ComboBox
                options={sistemas}
                onSelect={handleSistemaSelect}
                label="Seleccione un Sistema"
                getOptionLabel={(option: Sistema) => option.sis_clave}
              />
            </Box>
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
          <SistemasTable
            ref={tableRef}
            data={sistemas}
            onSelectionChange={setSelectedIds}
            onUpdateSistema={handleEditSistema}
            onDeleteSistema={handleDeleteSistema}
            filterValue={filterValue}
          />
          <AddSistemaModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveSistema}
            initialData={editingSistema}
          />
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        content="¿Estás seguro de que deseas eliminar este sistema? Esta acción no se puede deshacer."
        onClose={(confirmed) => {
          setConfirmOpen(false);
          if (confirmed) confirmAction();
        }}
      />
    </Box>
  );
};

export default SistemasPage;
