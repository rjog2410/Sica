import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { useNotification } from '../../providers/NotificationProvider';
import BodyHeader from '../../components/base/BodyHeader';
import SistemasTable from '../../components/base/tabla/SistemasTable';
import { Sistema } from '../../types';
import * as service from './Selectores/serviceSelectorMenuPantallas'; // Usamos serviceSelector para mocks y API
import AddMenuModal from './Modales/AddMenuModal';
import AddPantallaModal from './Modales/AddPantallaModal';
import ComboBox from '../../components/base/tabla/Combobox';
import ConfirmDialog from '../../components/base/ConfirmDialog';

const MenusPantallasPage: React.FC = () => {
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
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { notify } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await service.fetchSistemas();
        setSistemas(data);
        notify('Sistemas cargados', 'info');
      } catch (error) {
        notify('Error al cargar los datos de sistemas', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [notify]);

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
      const responseMessage = await service.createOrUpdateSistema(newSistema,editando);
      if (editando) {
        // Actualizar el sistema en el estado local
       // setSistemas(sistemas.map((sistema) =>
         // sistema.sis_clave === editingSistema.sis_clave ? newSistema : sistema
        //));
        notify( 'Sistema actualizado correctamente', 'success');
      } else if(responseMessage.status=='400'){
        notify(responseMessage.message,'warning');
      }else{
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
      const responseMessage = await service.deleteSistema(sis_clave);
      console.log (responseMessage);
      if(responseMessage?.status=='200'){
        setSistemas(sistemas.filter((sistema) => sistema.sis_clave !== sis_clave));

        notify('Sistema eliminado correctamente', 'success');
      }else{
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
      const responseMessage = await service.deleteMultipleSistemas(sis_claves);
      console.log("-----"+responseMessage?.status);
      if(responseMessage?.status=='200'){
        setSistemas(sistemas.filter((sistema) => !sis_claves.includes(sistema.sis_clave)));
        setSelectedIds([]);        
        notify('Sistemas eliminados correctamente', 'success');
        }else{
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


  class OrderItemRow extends React.Component {
    render() {
      const { item } = this.props
      return (
        <tr>
          <td>
            <img src={item.image} alt={item.name} width="50"/>
            {item.name}
          </td>
          <td>
            {item.selectedOption}
          </td>
        </tr>
      )
    }
  }

  return (
    <Box>
      <BodyHeader
        headerRoute="Seguridad / Menus - Pantallas"
        TitlePage="Menu - Pantallas"
        tooltipProps={{ title: "Información sobre los menus y pantallas" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      {loading ? (
        <div>Cargando datos...</div>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} >
            
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
          <AddMenuModal
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

export default MenusPantallasPage;
