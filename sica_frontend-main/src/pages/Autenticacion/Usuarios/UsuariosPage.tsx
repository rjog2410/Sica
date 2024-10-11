import React, {useEffect, useRef, useState} from "react";
import {
    Autocomplete,
    Box,
    Button, Chip, Collapse, Dialog, DialogActions,
    DialogContent,
    Grid,
    List,
    ListItem,
    ListItemButton, ListItemText,
    ListSubheader,
    TextField
} from "@mui/material";
import BodyHeader from "@/components/base/BodyHeader.tsx";
import {
    deleteUsuario, fetchActUsuario, fetchAssignUsuario, fetchCrearUsuario,
    fetchDelUsuarios,
    fetchPantallas, fetchRoles, fetchUsuarioPermisos,
    fetchUsuarios
} from "@/pages/Autenticacion/Usuarios/Service.tsx";
import {useNotification} from "@/providers/NotificationProvider.tsx";
import UsuariosTable from "@/pages/Autenticacion/Usuarios/UsuariosTable.tsx";
import ConfirmDialog from "@/components/base/ConfirmDialog.tsx";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {Pantalla, Rol, Usuario} from "@/types.ts";

const UsuariosPage: React.FC = () => {
    const initUser: Usuario = {
        id:-1,
        nombre:"",
        username:"",
        ubicacion:"",
        roles:[],
        rolesString:""
    }
    const [isLoading, setIsLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [pantallas, setPantallas] = useState<Pantalla[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const tableRef = useRef<any>(null);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const {notify} = useNotification();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<Usuario>(initUser);
    const [openRoles, setOpenRoles] = React.useState(false);
    const [openPer, setOpenPer] = React.useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [currentPer, setCurrentPer] = useState<Pantalla[]>([]);

    useEffect(() => {
        getAll()
    }, []);

    const getAll = async () => {
        setIsLoading(true);
        fetchUsuarios().then((resp) => {
            if (resp?.status === 200) {
                fetchPantallas().then(respP => {
                    fetchRoles().then(respR => {
                        setUsuarios(resp.data)
                        setPantallas(respP?.data)
                        setRoles(respR?.data)
                        notify(respR?.message,"success");
                    })
                    notify(respP?.message,"success");
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

    useEffect(() => {
        if (currentUser.id !== -1) {
            fetchUsuarioPermisos(currentUser?.id).then(resp => {
                if(resp?.status === 200){
                    setCurrentPer(pantallas?.filter(pant => resp?.data?.includes(pant.id_pantalla)))
                }else{
                    setCurrentPer([])
                }
            })
        }
    }, [currentUser]);

    const handleClick = () => {
        setOpenRoles(!openRoles);
    };
    const handleClickPermi = () => {
        setOpenPer(!openPer);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCurrentUser({
            ...currentUser,
            [name]: value,
        });
    };

    const validate = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!currentUser?.nombre) {
            tempErrors.nombre = "Requerido";
        }
        if (!currentUser?.username) {
            tempErrors.username = "Requerido";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = () => {
        if(validate()){
            const reqUser = {...currentUser, rolesIds : currentUser.roles.map(role => role.id)}
            if(currentUser?.id === -1){
                fetchCrearUsuario(reqUser).then(resp => {
                    if(resp?.status === 200){
                        notify(resp?.message,"success")
                        const per = currentPer?.map(per => per.id_pantalla)
                        fetchAssignUsuario(resp?.data?.id,per).then(respP=>{
                            if(respP?.status === 200){
                                notify(respP?.message,"success")
                                getAll()
                            } else {
                                notify(respP?.message,"error")
                            }
                        })
                    }else {
                        notify(resp?.message,"error")
                    }
                })
            }else {
                fetchActUsuario(reqUser).then(resp => {
                    if(resp?.status === 200){
                        notify(resp?.message,"success")
                        const per = currentPer?.map(per => per.id_pantalla)
                        fetchAssignUsuario(resp?.data?.id,per).then(respP=>{
                            if(respP?.status === 200){
                                notify(respP?.message,"success")
                                getAll()
                            } else {
                                notify(respP?.message,"error")
                            }
                        })
                    }else {
                        notify(resp?.message,"error")
                    }
                })
            }
        }
        setIsOpen(!isOpen)
        setCurrentUser(initUser)
        setCurrentPer([])
        setErrors({})
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
                        setIsOpen(!isOpen);
                        setCurrentUser(initUser);
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
                onUpdateUsuario={(row)=>{
                    setIsOpen(!isOpen);
                    setCurrentUser(row);
                }}
                onDeleteUsuario={handleDeleteUsuario}
            />
            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(!isOpen)
                    setCurrentUser(initUser)
                    setCurrentPer([])
                    setErrors({})
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "900px",  // Set your width here
                        },
                    },
                }}
            >
                <DialogContent>
                    <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper', height:'100%'}}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        Información de usuario
                                    </ListSubheader>
                                }
                            >
                                <ListItem  >
                                    <TextField
                                        fullWidth
                                        label="Usuario"
                                        name="username"
                                        value={currentUser?.username}
                                        onChange={handleChange}
                                        error={!!errors.username}
                                        helperText={errors.username}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        name="nombre"
                                        value={currentUser?.nombre}
                                        onChange={handleChange}
                                        error={!!errors.nombre}
                                        helperText={errors.nombre}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Ubicacion"
                                        name="ubicacion"
                                        value={currentUser?.ubicacion}
                                        onChange={handleChange}
                                        error={!!errors.ubicacion}
                                        helperText={errors.ubicacion}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Telefono"
                                        name="telefono"
                                        value={currentUser?.telefono}
                                        onChange={handleChange}
                                        error={!!errors.telefono}
                                        helperText={errors.telefono}
                                        type={"number"}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Transferencia"
                                        name="transferencia"
                                        value={currentUser?.transferencia}
                                        onChange={handleChange}
                                        error={!!errors.transferencia}
                                        helperText={errors.transferencia}
                                    />
                                </ListItem>
                                <ListItemButton onClick={handleClick}>
                                    <ListItemText primary="Roles" />
                                    {openRoles ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openRoles} timeout="auto" unmountOnExit>
                                    <Autocomplete
                                        multiple
                                        id="tags-filled"
                                        value={currentUser?.roles}
                                        onChange={(event: any, newValue) => {
                                            setCurrentUser({...currentUser, roles:newValue});
                                        }}
                                        options={roles}
                                        getOptionLabel={(option) => option.nombre_rol}
                                        freeSolo
                                        renderTags={(value: readonly Rol[], getTagProps) =>
                                            value.map((option: Rol, index: number) => {
                                                const {key, ...tagProps} = getTagProps({index});
                                                return (
                                                    <Chip variant="outlined" label={option.nombre_rol} key={key} {...tagProps} />
                                                );
                                            })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="filled"
                                                label="Rol"
                                                placeholder="Roles"
                                            />
                                        )}
                                    />
                                </Collapse>
                                <ListItemButton onClick={handleClickPermi}>
                                    <ListItemText primary="Permisos" />
                                    {openPer ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openPer} timeout="auto" unmountOnExit>
                                    <Autocomplete
                                        multiple
                                        id="tags-filled"
                                        value={currentPer}
                                        onChange={(event: any, newValue) => {
                                            setCurrentPer(newValue);
                                        }}
                                        options={pantallas}
                                        getOptionLabel={(option) => option.nombre_pantalla}
                                        freeSolo
                                        renderTags={(value: readonly Pantalla[], getTagProps) =>
                                            value.map((option: Pantalla, index: number) => {
                                                const {key, ...tagProps} = getTagProps({index});
                                                return (
                                                    <Chip variant="outlined" label={option.nombre_pantalla} key={key} {...tagProps} />
                                                );
                                            })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="filled"
                                                label="Permisos"
                                                placeholder="Permisos"
                                            />
                                        )}
                                    />
                                </Collapse>
                            </List>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>
                        {currentUser?.id !=- 1 ? "Guardar":"Crear" }
                    </Button>
                </DialogActions>
            </Dialog>
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