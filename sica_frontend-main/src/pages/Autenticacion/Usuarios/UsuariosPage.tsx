import React, {useEffect, useRef, useState} from "react";
import {Box, Button, Grid} from "@mui/material";
import BodyHeader from "@/components/base/BodyHeader.tsx";
import {
    deleteUsuario,
    fetchDelUsuarios,
    fetchPantallas,
    fetchUsuarios
} from "@/pages/Autenticacion/Usuarios/Service.tsx";
import {useNotification} from "@/providers/NotificationProvider.tsx";
import UsuariosTable from "@/pages/Autenticacion/Usuarios/UsuariosTable.tsx";
import ConfirmDialog from "@/components/base/ConfirmDialog.tsx";

const UsuariosPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [pantallas, setPantallas] = useState([]);
    const tableRef = useRef<any>(null);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const {notify} = useNotification();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        getAll()
    }, []);

    const getAll = async () => {
        setIsLoading(true);
        fetchUsuarios().then((resp) => {
            if (resp?.status === 200) {
                fetchPantallas().then(respP => {
                    setUsuarios(resp.data)
                    setPantallas(respP?.data)
                })
                notify(resp?.message,"success");
            } else {
                notify(resp?.message,"error");
            }
            setIsLoading(false);
        })
    }

    const handleDeleteUsuario = (id: number) => {
        if (!id) {
            notify('Usuario no encontrado', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await deleteUsuario(id).then(resp => {
                    if (resp?.status === 200) {
                        notify(resp?.message, 'success');
                        setUsuarios(usuarios?.filter(user => user?.id !== id))
                    } else {
                        notify(resp?.message, 'error');
                    }
                });
            } catch (error) {
                notify('No es posible eliminar el registro.', 'error');
            }
        });
        setConfirmOpen(true);
    };

    const handleDeleteMultiple = (users : number[]) => {
        if (users.length === 0) {
            notify('No se encontraron usuarios para eliminar', 'error');
            return;
        }
        setConfirmAction(() => async () => {
            try {
                await fetchDelUsuarios(users).then(resp => {
                    if (resp?.status === 200) {
                        setUsuarios(usuarios.filter(form => !users.includes(form?.id)))
                        notify(resp?.message, 'success');
                    } else {
                        notify(resp?.message, 'error');
                    }
                });

            } catch (error) {
                notify('No es posible eliminar los registros.', 'error');
            }
        });
        setConfirmOpen(true);
    }


    return (
        <Box>
            <BodyHeader
                headerRoute="Administración / Usuarios"
                TitlePage="Administración de usuarios"
                tooltipProps={{title: "Administración de usuarios"}}
                typographyPropsRoute={{variant: "h6"}}
                typographyPropsTitle={{variant: "h3"}}
            />
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <Button variant="contained" color="primary" onClick={() => {
                    }} sx={{mr: 1}} disabled={isLoading}>
                        {isLoading ? 'Buscando...' : 'Crear usuario'}
                    </Button>
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
                </Grid>
            </Grid>
            <UsuariosTable
                ref={tableRef}
                data={usuarios}
                pantallas={pantallas}
                onSelectionChange={setSelectedIds}
                onUpdateUsuario={()=>{}}
                onDeleteUsuario={handleDeleteUsuario}
            />
            <ConfirmDialog
                open={confirmOpen}
                title="Confirmar eliminación"
                content="¿Estás seguro de que deseas eliminar? Esta acción no se puede deshacer."
                onClose={(confirmed) => {
                    setConfirmOpen(false);
                    if (confirmed) confirmAction();
                }}
            />
        </Box>
    )
}

export default UsuariosPage;