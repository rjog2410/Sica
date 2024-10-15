import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button, Dialog, DialogActions,
    DialogContent,
    Grid,
    List,
    ListItem,
    ListSubheader,
    MenuItem,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import BodyHeader from "@/components/base/BodyHeader.tsx";
import {
    deletePantalla, fetchActPantalla, fetchCrearPantalla, fetchDelPantallas,
    fetchPantallas,getMenu
} from "@/pages/Autenticacion/Pantallas/Service.tsx";
import { useNotification } from "@/providers/NotificationProvider.tsx";
import PantallasTable from "@/pages/Autenticacion/Pantallas/PantallasTable.tsx";
import ConfirmDialog from "@/components/base/ConfirmDialog.tsx";
import { Menu, Pantallas } from "@/types.ts";


const PantallasPage: React.FC = () => {
    const initPantalla: Pantallas = {
        id_pantalla: -1,
        nombre: "",
        tipo: "",
        url: "",
        id_menu: 0,
        nombre_menu: ""
    }
    const [isLoading, setIsLoading] = useState(false);
    const [pantallas, setPantallas] = useState<Pantallas[]>([]);
    const tableRef = useRef<any>(null);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
    const { notify } = useNotification();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentPantalla, setCurrentPantalla] = useState<Pantallas>(initPantalla);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [currentPer, setCurrentPer] = useState<Pantallas[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);


    useEffect(() => {
        getAll()
    }, []);

    const getAll = async () => {
        setIsLoading(true);
        fetchPantallas().then((resp) => {
            if (resp?.status === 200) {
                setPantallas(resp.data)
                getMenu().then((respM) => {
                    if (respM?.status === 200) {
                        setMenus(respM.data)
                        notify(respM?.message, "success");
                    } else {
                        notify(respM?.message, "error");
                    }
                    setIsLoading(false);
                })
                notify(resp?.message, "success");
            } else {
                notify(resp?.message, "error");
            }
            setIsLoading(false);
        })
    };
  

    const handleDeletePantalla = (id: number) => {
        if (!id) {
            notify('Pantalla no encontrado', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await deletePantalla(id).then(resp => {
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

    const handleDeleteMultiple = (Pantallas: number[]) => {
        if (Pantallas.length === 0) {
            notify('No se encontraron Pantallas para eliminar', 'error');
            return;
        }
        setConfirmAction(() => async () => {
            try {
                await fetchDelPantallas(Pantallas).then(resp => {
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
        const { name, value } = e.target;
        setCurrentPantalla({
            ...currentPantalla,
            [name]: value,
        });
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setCurrentPantalla({
          ...currentPantalla,
          [name!]: value, // Asignamos "%" si selecciona "TODOS"
        });
      };

    const validate = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!currentPantalla?.nombre) {
            tempErrors.nombre = "Requerido";
        }
        if (!currentPantalla?.tipo) {
            tempErrors.tipo = "Requerido";
        }
        if (!currentPantalla?.url) {
            tempErrors.url = "Requerido";
        }
        if (!currentPantalla?.id_menu) {
            tempErrors.id_menu = "Requerido";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = () => {
        currentPantalla.nombre_pantalla=currentPantalla.nombre;
        if (validate()) {
            if (currentPantalla?.id_pantalla === -1) {
                fetchCrearPantalla(currentPantalla).then(resp => {
                    if (resp?.status === 200) {
                        notify(resp?.message, "success")

                    } else {
                        notify(resp?.message, "error")
                    }
                })
            } else {
                fetchActPantalla(currentPantalla).then(resp => {
                    if (resp?.status === 200) {
                        notify(resp?.message, "success")

                    } else {
                        notify(resp?.message, "error")
                    }
                })
            }
        }
        setIsOpen(!isOpen)
        setCurrentPantalla(initPantalla)
        setCurrentPer([])
        setErrors({})
    }


    return (
        <Box>
            <BodyHeader
                headerRoute="Administración / Pantallas"
                TitlePage="Administración de Pantallas"
                tooltipProps={{ title: "Administración de Pantallas" }}
                typographyPropsRoute={{ variant: "h6" }}
                typographyPropsTitle={{ variant: "h3" }}
            />
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <Button variant="contained" color="primary" onClick={() => {
                        setIsOpen(!isOpen);
                        setCurrentPantalla(initPantalla);
                    }} sx={{ mr: 1 }} disabled={isLoading}>
                        {isLoading ? 'Buscando...' : 'Crear Pantalla'}
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
            <PantallasTable
                ref={tableRef}
                data={pantallas}
                onSelectionChange={setSelectedIds}
                onUpdatePantalla={(row) => {
                    setIsOpen(!isOpen);
                    setCurrentPantalla(row);
                }}
                onDeletePantalla={handleDeletePantalla}
            />
            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(!isOpen)
                    setCurrentPantalla(initPantalla)
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
                                sx={{ width: '100%', bgcolor: 'background.paper', height: '100%' }}
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
                                        value={currentPantalla?.nombre_pantalla
                                        }
                                        onChange={handleChange}
                                        error={!!errors.nombre}
                                        helperText={errors.nombre}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Tipo"
                                        name="tipo"
                                        value={currentPantalla?.tipo}
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
                                        value={currentPantalla?.url}
                                        onChange={handleChange}
                                        error={!!errors.url}
                                        helperText={errors.url}
                                    />
                                </ListItem>

                                <ListItem>
                                    <TextField
                                        select
                                        label="Menu"
                                        value={currentPantalla.id_menu}
                                        name="id_menu"
                                        onChange={handleSelectChange}
                                        fullWidth
                                        required
                                        error={!!errors.id_menu}
                                        helperText={errors.id_menu}
                                    > 
                                    {
                                            menus?.map(menu => <MenuItem value={menu.id}>{menu.nombre}</MenuItem>)
                                        }
                                    </TextField>

                                </ListItem>

                            </List>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>
                        {currentPantalla?.id_pantalla != - 1 ? "Guardar" : "Crear"}
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

export default PantallasPage;