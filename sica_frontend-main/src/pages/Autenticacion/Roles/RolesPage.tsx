import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import BodyHeader from '../../../components/base/BodyHeader';
import RolesTable from './RolesTable';
import { Rol , Pantalla} from '../../../types';
import { useNotification } from '../../../providers/NotificationProvider';
import ConfirmDialog from '../../../components/base/ConfirmDialog';
import ModalRol from './ModalRol';
import * as serviceRol from './ServiceSelectorRoles';
import { fetchPantallas} from "@/pages/Autenticacion/Usuarios/Service.tsx";
import useAuthStore from '../../../store/authStore'; //para permisos
import { useNavigate } from 'react-router-dom'; //para permisos

const RolesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [pantallas, setPantallas] = useState<Pantalla[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRol, setEditingRol] = useState<Rol | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { notify } = useNotification();
  const tableRef = useRef<any>(null);
  //ajuste permisos start
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore(); 
  console.log(hasPermission);
  const requiredPermission = '/sica/autenticacion/rol';
    useEffect(() => {
      if (!hasPermission(requiredPermission)) {
        notify('No tienes permisos para acceder a esta página', 'error');
        navigate('/');
      }
    }, [hasPermission, navigate, notify]);
  
    //ajustes permisos end


    useEffect(() => {
      serviceRol.fetchRoles().then(resp => {
        if (!!resp && resp.length > 0) {
          setRoles(resp);
  
        }
      }).catch(error => {
        console.error('Error al cargar los roles:', error);
        notify('Error al cargar los roles', 'error');
      })
    }, []);

 
    const getPantallas = async () => {
      setIsLoading(true);     
      fetchPantallas().then(respP => {
        //console.log("respuesta pantallas: ", respP);
        if (respP?.status === 200) {
          setPantallas(respP?.data);                    
        } else {
          setPantallas([]);
          notify(respP?.message,"error");
        }
        setIsLoading(false);
      });
  }

  const handleOpenModal = () => {
    getPantallas();
    setEditingRol(null);
    setIsModalOpen(true);
  };

  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPantallas([]);
  };

  const handleSaveRol = async (newRol: Rol) => {
    try {
      if (editingRol != null) {

        console.log("editando rol: ", newRol);
        serviceRol.createOrUpdateRol(newRol, true).then(resp => {
          if (resp?.data?.status == 200) {
            setRoles(roles.map((rol) =>
              (rol.id === editingRol.id ) ? newRol : rol
            ));
            notify('Rol actualizado correctamente', 'success');
          } else {
            notify(resp?.data?.message, 'info');
          }


        }).catch(resp => {
          console.log("respuesta error de editando: ", resp?.data?.message);
          notify('No fue posible actualizar el rol', 'error');
        });

      } else {
         console.log("nuevo rol: ", newRol);
        serviceRol.createOrUpdateRol(newRol).then(resp => {
          console.log("respuesta agregar rol: ",resp);

          if (resp?.data?.status == 200) {
            serviceRol.fetchRoles().then(resp2 => {
              if (!!resp2 && resp2.length > 0) {
                setRoles(resp2);
              }
            }).catch(error => {
              console.error('Error al cargar los roles:', error);
              notify('Error al cargar los roles', 'error');
            })
            notify("Rol creado exitosamente.", 'success');
          } else {
            notify(resp?.data?.message, 'info');
          }

        }).catch(resp => {
          console.log("error agregar rol: ", resp?.data?.message);
          notify('No fue posible agregar el rol', 'error');
        });

      }
    } catch (error) {
      notify('No es posible guardar el registro.', 'error');
    }
    handleCloseModal();
  };

  const handleEditRol = (rol: Rol) => {
    getPantallas();
    setEditingRol(rol);
    setIsModalOpen(true);
  };

  const handleDeleteRol = (id: number) => {
    const rolToDelete = roles.find(rol => rol.id === id);

    if (!rolToDelete) {
      notify('Rol no encontrado', 'error');
      return;
    }

    setConfirmAction(() => async () => {
      try {
        await serviceRol.deleteRol(rolToDelete);  
        setRoles(roles.filter(rol => rol.id !== id));
        notify('Rol eliminado correctamente', 'success');
      } catch (error) {
        notify('No es posible eliminar el registro.', 'error');
      }
    });
    setConfirmOpen(true);
  };

    
  const handleDeleteMultiple = (rolIds: number[]) => {
    

    setConfirmAction(() => async () => {
      try {
        // console.log("roles a eliminar: ",rolesToDelete);
        await serviceRol.deleteMultipleRoles(rolIds).then(resp => {
          if (resp.status === 200) {
            setRoles(roles.filter(form => !rolIds.includes(form?.id)))
            notify(resp.message, 'success');
            // console.log("roles eliminadoas correctamente");
          } else {
            notify(resp.message, 'info');
            // console.log("ocurrio un error al eliminar roles: ",resp.message);
          }

        }).catch(error => {
          notify(error.response.data.message, 'error');
          // console.log("ocurrio un error al eliminar roles: ",error.response.data.message);
        })

      } catch (error) {
        notify('No es posible eliminar los registros.', 'error');
        // console.log("roles eliminados correctamente");
      }
    });
    setConfirmOpen(true);
  };



  return (
    <Box>
      <BodyHeader
        headerRoute="Administración / Roles"
        TitlePage="Roles"
        tooltipProps={{ title: "Información sobre la Gestión de Roles" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      
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
        </Box>
      </Box>
      <RolesTable
        ref={tableRef}
        data={roles}
        onSelectionChange={setSelectedIds}
        onUpdateRol={handleEditRol}
        onDeleteRol={handleDeleteRol}
      />
      <ModalRol
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRol}
        initialData={editingRol}
        pantallas={pantallas}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        content="¿Estás seguro de que deseas eliminar éste rol? Esta acción no se puede deshacer."
        onClose={(confirmed) => {
          setConfirmOpen(false);
          if (confirmed) confirmAction();
        }}
      />
    </Box>
  );
};

export default RolesPage;