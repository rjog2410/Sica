import React, {useState, useEffect, useRef} from 'react';
import {Autocomplete, Box, Button, TextField} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import CuentasTable from '../../components/base/tabla/CuentasTable';
import {Cuenta, Formula, Regla, Sistema} from '../../types';
import * as service from './selectores/serviceSelectorCuentaRegla';
import {useNotification} from '../../providers/NotificationProvider';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import AddCuentaModal from './modales/AddCuentaModal';
import * as serviceSistema from "@/pages/Catalogos/selectores/serviceSelectorSistemas.ts";
import ReglasSubpantallaModal from './modales/ReglasSubpantallaModal';
import {fetchModuloByClave, fetchModulos} from "@/pages/Catalogos/selectores/serviceSelectorModulos.ts";
import {
    getAllCuentas,
    getCuentasBySistema,
    getCuentasBySistemaAndModulo, getFormulas, getReglas
} from "./selectores/serviceSelectorCuentaRegla";
import {
    createFormula,
    deleteFormula,
    deleteMultipleFormula, fetchReglas,
    updateCuenta
} from "@/pages/Catalogos/servicios/cuentasReglaService.ts"; // Asumiendo que tienes este modal para manejar las reglas


const CuentaPage: React.FC = () => {

    const originalObject: Cuenta = {
        cuc_clave: 0,
        cuc_mod_sis_clave: '',
        cuc_mod_clave: '',
        cuc_cuenta: 0,
        cuc_scta1: '',
        cuc_scta2: '',
        cuc_scta3: '',
        cuc_scta4: '',
        cuc_scta5: '',
        cuc_scta6: '',
        cuc_scta7: '',
        cuc_tipo_ente: 0,
        cuc_ente: 0,
        cuc_consolida_ente: 'N',
        cuc_inc_saldo: 'N',
        cuc_inc_movs: 'N',
        cuc_inc: ''
    }

    const originalRule: Regla = {
        id: 0,
        clave_regla: '',
        descripcion: '',
        reg_cuc_clave: 0,
        reg_tit_mod_sis_clave: '',
        reg_tit_mod_clave: '',
        reg_tit_columna: 0,
        reg_secuencia: 0,
        reg_operador: '',
        reg_valor: ''
    }

    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    const [sistemas, setSistemas] = useState<Sistema[]>([]);
    const [reglas, setReglas] = useState<Regla[]>([]);
    const [selectedSistema, setSelectedSistema] = useState<string | null>('ALL');
    const [selectedModulo, setSelectedModulo] = useState<string | null>('ALL');
    const [filteredCuentas, setFilteredCuentas] = useState<Cuenta[]>([]);
    const [modulos, setModulos] = useState<string[]>([]);
    const [isCuentaModalOpen, setIsCuentaModalOpen] = useState<boolean>(false); // Estado para el modal de cuentas
    const [isSubpantallaOpen, setIsSubpantallaOpen] = useState<boolean>(false); // Estado para la subpantalla de reglas
    const [editingCuenta, setEditingCuenta] = useState<Cuenta | null>(originalObject); // Estado para la cuenta que se está editando
    const [currentFormulas, setCurrentFormulas] = useState<Formula[]>([]); // Estado para las reglas asociadas a una cuenta
    const [currentReglas, setCurrentReglas] = useState<Regla[]>([]); // Estado para las reglas asociadas a una cuenta
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [cuentaInfo, setCuentaInfo] = useState<Cuenta>(originalObject);


    const {notify} = useNotification();
    const tableRef = useRef<any>(null);

    useEffect(() => {
        serviceSistema.fetchSistemas().then(resp => {
            if (!!resp && resp.length > 0) {
                setSistemas(resp);
            }
        }).catch(error => {
            console.error(error);
            notify('Error al cargar los datos de sistema', 'error');
        })
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cuentasData: Cuenta[] = await service.getAllCuentas();
                setCuentas(cuentasData);
            } catch (error) {
                console.error('Error al cargar los datos de cuentas:', error);
                notify('Error al cargar los datos de cuentas', 'error');
            }
        };

        fetchData();
    }, [notify]);

    useEffect(() => {
        if (!!selectedSistema && selectedSistema !== 'ALL') {
            fetchModuloByClave(selectedSistema).then(resp => {
                setModulos(['ALL', ...Array.from(new Set(resp?.map(modulo => modulo?.mod_clave)))]);
            });
            getCuentasBySistema(selectedSistema).then(resp => {
                setFilteredCuentas(resp);
            })
        } else {
            fetchModulos().then(resp => {
                setModulos(['ALL', ...Array.from(new Set(resp?.map(modulo => modulo?.clave_modulo)))]);
            });
            getAllCuentas().then(resp => {
                setFilteredCuentas(resp);
            })
        }
        setSelectedModulo('ALL');
    }, [selectedSistema]);

    useEffect(() => {
        if (!!selectedModulo && selectedModulo !== 'ALL' && !!selectedSistema && selectedSistema !== 'ALL') {
            getCuentasBySistemaAndModulo(selectedSistema, selectedModulo).then(resp => {
                setFilteredCuentas(resp);
            })
        } else if (!!selectedSistema && selectedSistema !== 'ALL') {
            getCuentasBySistema(selectedSistema).then(resp => {
                setFilteredCuentas(resp);
            })
        } else {
            getAllCuentas().then(resp => {
                setFilteredCuentas(resp);
            })
        }
    }, [selectedModulo]);


    const handleSistemaSelect = (sistema: string | null) => {
        setSelectedSistema(sistema);
        setSelectedModulo('ALL');
    };

    const handleModuloSelect = (modulo: string | null) => {
        setSelectedModulo(modulo);
    };

    const handleSaveRegla = async (newRegla: Regla) => {
        try {
            if (newRegla.id <= currentReglas?.length) {
                console.log("Actualizando regla")
                await service.createOrUpdateRegla(newRegla, false).then(resp => {
                    if (resp?.data?.status === 400) {
                        notify(resp?.data?.message?.msg, 'error');
                    } else {
                        setReglas(reglas.map((regla) =>
                            regla.id === newRegla.id ? newRegla : regla
                        ));
                        notify(resp?.data?.message?.msg, 'success');
                    }
                });
            } else {
                console.log("Creando regla")
                await service.createOrUpdateRegla(newRegla, true).then(resp => {
                    if (resp?.data?.status === 400) {
                        notify(resp?.data?.message?.msg, 'error');
                    } else {
                        setReglas([...reglas, newRegla]);
                        notify(resp?.data?.message?.msg, 'success');
                    }
                });

            }
        } catch (error) {
            notify(error, 'error');
        }

        getReglas(cuentaInfo?.cuc_clave).then(resp => setCurrentReglas(resp?.map((reg, i) => ({...reg, id: i}))))

    };

    const handleSaveFormula = async (newFormula: Formula, isUpdate: boolean) => {
        console.log("newFormula: ", newFormula)
        try {
            await createFormula(newFormula, isUpdate).then(resp => {
                if (resp?.data?.status === 400) {
                    notify(resp?.data?.message?.msg, 'error');
                } else {
                    notify(resp?.data?.message?.msg, 'success');
                }
            });
        } catch (error) {
            notify('Error al guardar la formula', 'error');
        }

        getFormulas(cuentaInfo?.cuc_clave).then(resp => setCurrentFormulas(resp?.map((form, index) => ({
            ...form,
            id: index
        }))))
    };


    const handleOpenCuentaModal = () => {
        setEditingCuenta(editingCuenta);
        setIsCuentaModalOpen(true);
    };

    const handleCloseCuentaModal = () => {
        setEditingCuenta(originalObject);
        setIsCuentaModalOpen(false);

    };

    const handleSaveCuenta = async (cuenta: Cuenta, isUpdate : boolean) => {
        try {
            if(!isUpdate){
                await service.createOrUpdateCuentaRegla(cuenta).then(resp =>{
                    if(resp?.data?.status ===200){
                        setCuentas([...cuentas, cuenta]);
                        notify(resp?.data?.message, 'success');
                    }
                });
            }else{
                console.log("Updating new account")
                await updateCuenta(cuenta).then(resp =>{
                    if(resp?.data?.status ===200){
                        setCuentas(cuentas.map(c => (c.cuc_clave === cuenta.cuc_clave ? cuenta : c)));
                        notify(resp?.data?.message, 'success');
                    }
                });
            }
        } catch (error) {
            notify('Error al guardar la cuenta', 'error');
        }
        setIsCuentaModalOpen(false);
        getAllCuentas().then(resp => {
            setFilteredCuentas(resp);
        })
    };

    const handleEditCuenta = (cuenta: Cuenta) => {
        setEditingCuenta(cuenta);
        setIsCuentaModalOpen(true);
    };

    const handleViewRules = (id: number) => {
        const cuentaSeleccionada = cuentas.find(cuenta => cuenta.cuc_clave === id);

        if (!cuentaSeleccionada) {
            notify('Cuenta no encontrada', 'error');
            return;
        }else {
            fetchReglas(cuentaSeleccionada?.cuc_clave).then(resp => {

                getFormulas(cuentaSeleccionada?.cuc_clave).then(respF => {
                    setCurrentFormulas(respF?.map((form, index) => ({
                        ...form,
                        id: index
                    })))

                    setCurrentReglas(resp?.map((reg, i) => ({
                        ...reg,
                        id: i
                    })))
                })
            }).finally( () =>{
                setCuentaInfo(cuentaSeleccionada)
                setIsSubpantallaOpen(true);
            })
        }
    };

    const handleDeleteRegla = (id: number) => {
        const reglaToDelete = currentReglas.find(regla => regla.id === id);

        if (!reglaToDelete) {
            notify('Regla no encontrada', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await service.removeRegla(reglaToDelete).then(resp => {
                    console.log("DeleteReg: ", resp)
                    if(resp?.status === 200){
                        setCurrentReglas(currentReglas.filter(regla => reglaToDelete?.id !== regla.id))
                        notify(resp?.data?.message, 'success');
                    }else {
                        notify(resp?.message, 'error');
                    }
                });
            } catch (error) {
                notify('Error al eliminar la regla', 'error');
            }
        });
        setConfirmOpen(true);
    };


    const handleDeleteCuenta = (id: number) => {
        const cuentaToDelete = filteredCuentas.find(cuenta => cuenta.cuc_clave === id);
        console.log("Cuenta encontrada: ", cuentaToDelete)
        if (!cuentaToDelete) {
            notify('Cuenta no encontrada', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await service.removeCuenta(cuentaToDelete?.cuc_clave).then(resp => {
                    if (resp?.status === 200) {
                        notify(resp?.message, 'success');
                        setFilteredCuentas(filteredCuentas?.filter(cuenta => cuenta.cuc_clave !== id))
                    } else {
                        notify(resp?.message, 'error');
                    }
                });
            } catch (error) {
                notify('Error al eliminar la cuenta', 'error');
            }
        });
        setConfirmOpen(true);
    };


    const handleDeleteMultiple = (ids: number[]) => {
        const cuentasToDelete: Cuenta[] = filteredCuentas.find(cuenta => ids?.includes(cuenta?.cuc_clave));

        if (cuentasToDelete?.length === 0) {
            notify('No se encontraron cuentas para eliminar', 'error');
            return;
        }
        setConfirmAction(() => async () => {
            try {
                await service.removeMultipleCuentas(ids).then(res => {
                    if (res?.status === 200) {
                        setFilteredCuentas(filteredCuentas?.filter(cuenta => !ids?.includes(cuenta?.cuc_clave)))
                        //notify('Cuentas eliminadas correctamente', 'success');
                    } else {
                        //notify('Error al eliminar las cuentas', 'error');
                    }
                });
            } catch (error) {
                notify('Error al eliminar las cuentas', 'error');
            }
        });
        setSelectedIds([])
        setConfirmOpen(true);
    };

    const handleDeleteMultipleReglas = (ids: number[]) => {
        const reglasToDelete : Regla [] = currentReglas.filter(regla => ids.includes(regla.id));

        if (reglasToDelete.length === 0) {
            notify('No se encontraron reglas para eliminar', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await service.removeMultipleReglas(reglasToDelete).then(resp => {
                    if(resp?.status === 200){
                        setCurrentReglas(currentReglas.filter(regla => !ids.includes(regla.id)))
                        notify(resp?.message, 'success');
                    }else {
                        notify(resp?.message, 'error');
                    }
                });

            } catch (error) {
                notify('Error al eliminar las reglas', 'error');
            }
        });
        setConfirmOpen(true);
    };

    const handleDeleteFormula = (id: number) => {
        const formulaToDelete = currentFormulas.find(formula => formula.id === id);

        if (!formulaToDelete) {
            notify('Formula no encontrada', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await deleteFormula(formulaToDelete).then(resp => {
                    console.log("DeleteFormula: ", resp)
                    if(resp?.status === 200){
                        getFormulas(cuentaInfo?.cuc_clave).then(resp => setCurrentFormulas(resp?.map((form, index) => ({
                            ...form,
                            id: index
                        }))))
                        notify(resp?.message, 'success');
                    }else {
                        notify(resp?.message, 'error');
                    }
                });
            } catch (error) {
                notify('Error al eliminar la formula', 'error');
            }
        });
        setConfirmOpen(true);
    }

    const handleDeleteMultipleFormula = (ids: number[]) => {
        const formulasToDelete : Formula [] = currentFormulas.filter(formula => ids.includes(formula?.id));

        if (formulasToDelete.length === 0) {
            notify('No se encontraron formulas para eliminar', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await deleteMultipleFormula(formulasToDelete).then(resp => {
                    if(resp?.status === 200){
                        setCurrentFormulas(currentFormulas.filter(form => !ids.includes(form?.id)))
                        notify(resp?.message, 'success');
                    }else {
                        notify(resp?.message, 'error');
                    }
                });

            } catch (error) {
                notify('Error al eliminar las formulas', 'error');
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
        <Box sx={{ overflow: 'auto' }}>
            <BodyHeader
                headerRoute="Catálogos / Cuentas y Reglas"
                TitlePage="Cuentas y Reglas"
                tooltipProps={{title: "Información sobre la Gestión de Cuentas y Reglas"}}
                typographyPropsRoute={{variant: "h6"}}
                typographyPropsTitle={{variant: "h3"}}
            />
            <Box mb={2}>
                <Autocomplete
                    options={['ALL', ...Array.from(new Set(sistemas.map(cuenta => cuenta.sis_clave)))]}
                    onChange={(_event, value) => handleSistemaSelect(value)}
                    value = {selectedSistema}
                    renderInput={(params) => <TextField {...params} label={selectedSistema} variant="outlined" />} // Aplicamos la propiedad sx a TextField
                />
            </Box>
            <Box mb={2}>
                <Autocomplete
                    options={modulos}
                    onChange={(_event, value) => handleModuloSelect(value)}
                    disabled={selectedSistema === 'ALL'}
                    value = {selectedModulo}
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
                            sx={{mr: 1}}
                        >
                            Eliminar Selección
                        </Button>
                    )}
                    <Button variant="contained" color="primary" onClick={handleOpenCuentaModal} sx={{mr: 1}}>
                        Agregar Cuenta
                    </Button>
                    <Button
                        variant="contained"
                        sx={{backgroundColor: '#28a745', '&:hover': {backgroundColor: '#218838'}}}
                        onClick={handleExportExcel}
                    >
                        Exportar Excel
                    </Button>
                </Box>
            </Box>
            <CuentasTable
                ref={tableRef}
                data={filteredCuentas}
                onSelectionChange={setSelectedIds}
                onUpdateCuenta={handleEditCuenta}
                onDeleteCuenta={handleDeleteCuenta}
                onViewRules={handleViewRules}
            />
            <AddCuentaModal
                open={isCuentaModalOpen}
                onClose={handleCloseCuentaModal}
                onSave={handleSaveCuenta}
                initialData={editingCuenta}
            />
            <ReglasSubpantallaModal
                open={isSubpantallaOpen}
                onClose={() => setIsSubpantallaOpen(false)}
                cuenta={cuentaInfo}
                reglas={currentReglas}
                formulas={currentFormulas}
                onSaveRegla={handleSaveRegla}
                onSaveFormula={handleSaveFormula}
                onDeleteRegla={handleDeleteRegla}
                onDeleteFormula={handleDeleteFormula}
                onDeleteAllReglas={handleDeleteMultipleReglas}
                onDeleteAllFormula={handleDeleteMultipleFormula}
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
    );
};

export default CuentaPage;
