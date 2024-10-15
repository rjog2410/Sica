import React, {useEffect,useRef,  useState} from "react";
import {
    Box,
    Button,  Dialog, DialogActions,
    DialogContent,
    Grid,
    List,
    ListItem,
    ListSubheader,
    TextField
} from "@mui/material";
import BodyHeader from "@/components/base/BodyHeader.tsx";
import {
    deleteMenu, fetchActMenu, fetchCrearMenu,fetchDelMenu, 
    fetchMenu
} from "@/pages/Autenticacion/Menu/Service.tsx";
import {useNotification} from "@/providers/NotificationProvider.tsx";
import MenuTable from "@/pages/Autenticacion/Menu/MenuTable.tsx";
import ConfirmDialog from "@/components/base/ConfirmDialog.tsx";
import {Menu} from "@/types.ts";


const MenuPage: React.FC = () => {
    const initMenu: Menu = {
        id:-1,
        nombre:"",
        tipo:"",
        url:"",
        orden:""
    }
    const [isLoading, setIsLoading] = useState(false);
    const [menus, setMenu] = useState<Menu[]>([]);
    const tableRef = useRef<any>(null);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const {notify} = useNotification();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentMenu, setCurrentMenu] = useState<Menu>(initMenu);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [currentPer, setCurrentPer] = useState<Menu[]>([]);

    useEffect(() => {
        getAll()
    }, []);

    const getAll = async () => {
        setIsLoading(true);
        console.log("salen o no")
        fetchMenu().then((resp) => {
            if (resp?.status === 200) {
                        setMenu(resp.data)
                notify(resp?.message,"success");
            } else {
                notify(resp?.message,"error");
            }
            setIsLoading(false);
        })
    }

    const handleDeleteMenu = (id: number) => {
        if (!id) {
            notify('Menu no encontrado', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await deleteMenu(id).then(resp => {
                    if (resp?.status === 200) {
                        notify(resp?.message, 'success');
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

    const handleDeleteMultiple = (Menu : number[]) => {
        if (Menu.length === 0) {
            notify('No se encontraron Menu para eliminar', 'error');
            return;
        }
        setConfirmAction(() => async () => {
            try {
                await fetchDelMenu(Menu).then(resp => {
                    if (resp?.status === 200) {
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

   


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCurrentMenu({
            ...currentMenu,
            [name]: value,
        });
    };

    const validate = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!currentMenu?.nombre) {
            tempErrors.nombre = "Requerido";
        }
        if (!currentMenu?.orden) {
            tempErrors.orden = "Requerido";
        }
        if (!currentMenu?.tipo) {
            tempErrors.tipo = "Requerido";
        }
        if (!currentMenu?.url) {
            tempErrors.url = "Requerido";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = () => {
        if(validate()){
            if(currentMenu?.id === -1){
                fetchCrearMenu(currentMenu).then(resp => {
                    if(resp?.status === 200){
                        notify(resp?.message,"success")
                       
                    }else {
                        notify(resp?.message,"error")
                    }
                })
            }else {
                fetchActMenu(currentMenu).then(resp => {
                    if(resp?.status === 200){
                        notify(resp?.message,"success")
                       
                    }else {
                        notify(resp?.message,"error")
                    }
                })
            }
        }
        setIsOpen(!isOpen)
        setCurrentMenu(initMenu)
        setCurrentPer([])
        setErrors({})
    }


    return (
        <Box>
            <BodyHeader
                headerRoute="Administración / Menu"
                TitlePage="Administración de Menu"
                tooltipProps={{title: "Administración de Menu"}}
                typographyPropsRoute={{variant: "h6"}}
                typographyPropsTitle={{variant: "h3"}}
            />
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <Button variant="contained" color="primary" onClick={() => {
                        setIsOpen(!isOpen);
                        setCurrentMenu(initMenu);
                    }} sx={{mr: 1}} disabled={isLoading}>
                        {isLoading ? 'Buscando...' : 'Crear Menu'}
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
            <MenuTable
                ref={tableRef}
                data={menus}
                onSelectionChange={setSelectedIds}
                onUpdateMenu={(row)=>{
                    setIsOpen(!isOpen);
                    setCurrentMenu(row);
                }}
                onDeleteMenu={handleDeleteMenu}
            />
            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(!isOpen)
                    setCurrentMenu(initMenu)
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
                                        Información de la pantalla
                                    </ListSubheader>
                                }
                            >
                              
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        name="nombre"
                                        value={currentMenu?.nombre
                                        }
                                        onChange={handleChange}
                                        error={!!errors.nombre}
                                        helperText={errors.nombre}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Orden"
                                        name="orden"
                                        value={currentMenu?.orden}
                                        onChange={handleChange}
                                        error={!!errors.id_menu}
                                        helperText={errors.id_menu}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Tipo"
                                        name="tipo"
                                        value={currentMenu?.tipo}
                                        onChange={handleChange}
                                        error={!!errors.tipo}
                                        helperText={errors.tipo}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="URL"
                                        name="url"
                                        value={currentMenu?.url}
                                        onChange={handleChange}
                                        error={!!errors.url}
                                        helperText={errors.url}
                                    />
                                </ListItem>
                                
                                                              
                            </List>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>
                        {currentMenu?.id !=- 1 ? "Guardar":"Crear" }
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

export default MenuPage;