import React, { useState, useEffect, useRef } from 'react';
import {Box, Button} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import CuentasTable from '../../components/base/tabla/CuentasTable';
import ComboBox from '../../components/base/tabla/Combobox';
import {Cuenta, Formula, Regla, Sistema} from '../../types';
import * as service from './selectores/serviceSelectorCuentaRegla';
import { useNotification } from '../../providers/NotificationProvider';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import AddReglaModal from './modales/AddCuentaRegla';
import AddCuentaModal from './modales/AddCuentaModal';
import * as serviceSistema from "@/pages/Catalogos/selectores/serviceSelectorSistemas.ts";
import ReglasSubpantallaModal from './modales/ReglasSubpantallaModal';
import {fetchModuloByClave, fetchModulos} from "@/pages/Catalogos/selectores/serviceSelectorModulos.ts";
import {
    createOrUpdateFormula,
    getAllCuentas,
    getCuentasBySistema,
    getCuentasBySistemaAndModulo, getFormulas, getReglas
} from "./selectores/serviceSelectorCuentaRegla"; // Asumiendo que tienes este modal para manejar las reglas

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

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
        cuc_tipo_ente : 0,
        cuc_ente : 0,
        cuc_consolida_ente : 'N',
        cuc_inc_saldo : 'N',
        cuc_inc_movs : 'N',
        cuc_inc : ''
    }

    const originalRule : Regla = {
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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCuentaModalOpen, setIsCuentaModalOpen] = useState<boolean>(false); // Estado para el modal de cuentas
    const [isSubpantallaOpen, setIsSubpantallaOpen] = useState<boolean>(false); // Estado para la subpantalla de reglas
    const [editingRegla, setEditingRegla] = useState<Regla | null>(originalRule);
    const [editingCuenta, setEditingCuenta] = useState<Cuenta | null>(originalObject); // Estado para la cuenta que se está editando
    const [currentFormulas, setCurrentFormulas] = useState<Formula[]>([]); // Estado para las reglas asociadas a una cuenta
    const [currentReglas, setCurrentReglas] = useState<Regla[]>([]); // Estado para las reglas asociadas a una cuenta
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [cuentaInfo, setCuentaInfo] = useState<Cuenta>(originalObject);


    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    const { notify } = useNotification();
    const tableRef = useRef<any>(null);

    useEffect(() => {
        serviceSistema.fetchSistemas().then(resp => {
            if (!!resp && resp.length > 0) {
                setSistemas(resp);
            }
        }).catch(error => {
            console.error('Error al cargar los datos de sistemas:', error);
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
        } else {
            fetchModulos().then(resp => {
                setModulos(['ALL', ...Array.from(new Set(resp?.map(modulo => modulo?.clave_modulo)))]);
            });
        }
        setSelectedModulo('ALL');
    }, [selectedSistema]);

    useEffect(() => {
        if (!!selectedModulo && selectedModulo !== 'ALL' && !!selectedSistema && selectedSistema !== 'ALL') {
            getCuentasBySistemaAndModulo(selectedSistema,selectedModulo).then(resp =>{
                setFilteredCuentas(resp);
            })
        }else if (!!selectedSistema && selectedSistema !== 'ALL'){
            getCuentasBySistema(selectedSistema).then(resp => {
                setFilteredCuentas(resp);
            })
        }else{
            getAllCuentas().then(resp =>{
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

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingCuenta(null);
    };

    const handleSaveRegla = async (newRegla: Regla) => {
        try {
            if (newRegla.id <= currentReglas?.length) {
                console.log("Actualizando regla")
                await service.createOrUpdateRegla(newRegla, false).then( resp =>{
                    if(resp?.data?.status === 400){
                        notify(resp?.data?.message?.msg, 'error');
                    }else{
                        setReglas(reglas.map((regla) =>
                            regla.id === newRegla.id ? newRegla : regla
                        ));
                        notify('Regla actualizada correctamente', 'success');
                    }
                });

            } else {
                console.log("Creando regla")
                await service.createOrUpdateRegla(newRegla, true).then(resp => {
                    if(resp?.data?.status === 400){
                        notify(resp?.data?.message?.msg, 'error');
                    }else{
                        setReglas([...reglas, newRegla]);
                        notify('Regla agregada correctamente', 'success');
                    }
                });

            }
        } catch (error) {
            notify('Error al guardar la regla', 'error');
        }

        getReglas(cuentaInfo?.cuc_clave).then(resp =>  setCurrentReglas(resp?.map((reg,i) =>({...reg,id:i}))))

    };

    const handleSaveFormula = async (newFormula: Formula) => {
        console.log("newFormula: ",newFormula)
        try {
            await service.createOrUpdateFormula(newFormula, true).then( resp =>{
                if(resp?.data?.status === 400){
                    notify(resp?.data?.message?.msg, 'error');
                }else{
                    notify('Regla actualizada correctamente', 'success');
                }
            });
        } catch (error) {
            notify('Error al guardar la regla', 'error');
        }

        getFormulas(cuentaInfo?.cuc_clave).then(resp => setCurrentFormulas(resp?.map((form,index) => ({...form, id:index}))))
    };

    const handleOpenCuentaModal = () => {
        setEditingCuenta(editingCuenta);
        setIsCuentaModalOpen(true);
    };

    const handleCloseCuentaModal = () => {
        setIsCuentaModalOpen(false);
    };

    const handleSaveCuenta = async (cuenta: Cuenta) => {
        try {
            await service.createOrUpdateCuentaRegla(cuenta);
            if (cuenta.id) {

                setCuentas(cuentas.map(c => (c.id === cuenta.id ? cuenta : c)));
            } else {
                setCuentas([...cuentas, cuenta]);
            }
            notify('Cuenta guardada correctamente', 'success');
        } catch (error) {
            notify('Error al guardar la cuenta', 'error');
        }
        setIsCuentaModalOpen(false);
        getAllCuentas().then(resp =>{
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
        }
        getReglas(cuentaSeleccionada?.cuc_clave).then(resp =>  setCurrentReglas(resp?.map((reg,i) =>({...reg,id:i}))))
        getFormulas(cuentaSeleccionada?.cuc_clave).then(resp => setCurrentFormulas(resp?.map((form,index) => ({...form, id:index}))))
        setCuentaInfo(cuentaSeleccionada)
        setIsSubpantallaOpen(true);
    };

    const handleDeleteRegla = (id: number) => {
        const reglaToDelete = currentReglas.find(regla => regla.id === id);

        if (!reglaToDelete) {
            notify('Regla no encontrada', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await service.removeRegla(reglaToDelete?.id);
                //setReglas(reglas.filter((regla) => regla.id !== id));
                notify('Regla eliminada correctamente', 'success');
            } catch (error) {
                notify('Error al eliminar la regla', 'error');
            }
        });
        setConfirmOpen(true);
    };

    const handleDeleteMultiple = (ids: number[]) => {
        const reglasToDelete = reglas.filter(regla => ids.includes(regla.id));

        if (reglasToDelete.length === 0) {
            notify('No se encontraron reglas para eliminar', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                await service.removeMultipleReglas(ids);
                setReglas(reglas.filter(regla => !ids.includes(regla.id)));
                notify('Reglas eliminadas correctamente', 'success');
            } catch (error) {
                notify('Error al eliminar las reglas', 'error');
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
                headerRoute="Catálogos / Cuentas y Reglas"
                TitlePage="Cuentas y Reglas"
                tooltipProps={{ title: "Información sobre la Gestión de Cuentas y Reglas" }}
                typographyPropsRoute={{ variant: "h6" }}
                typographyPropsTitle={{ variant: "h3" }}
            />
            <Box mb={2}>
                <ComboBox
                    options={['ALL', ...Array.from(new Set(sistemas.map(cuenta => cuenta.sis_clave)))]}
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
                    <Button variant="contained" color="primary" onClick={handleOpenCuentaModal} sx={{ mr: 1 }}>
                        Agregar Cuenta
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mr: 1 }}>
                        Agregar Regla
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
            <CuentasTable
                ref={tableRef}
                data={filteredCuentas}
                onSelectionChange={setSelectedIds}
                onUpdateCuenta={handleEditCuenta}
                onDeleteCuenta={handleDeleteRegla}
                onViewRules={handleViewRules}
            />

            {/*<ReglasTable
                data={currentReglas}
                onUpdateRegla={handleSaveRegla}
                onDeleteRegla={handleDeleteRegla}
                onSelectionChange={setSelectedIds}
            />*/}
{/*            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Cuentas" {...a11yProps(0)} />
                <Tab label="Reglas" {...a11yProps(1)} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>

            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>

            </CustomTabPanel>*/}
{/*            <AddReglaModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRegla}
                initialData={editingRegla}
            />*/}
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
            />
            <ConfirmDialog
                open={confirmOpen}
                title="Confirmar eliminación"
                content="¿Estás seguro de que deseas eliminar esta regla? Esta acción no se puede deshacer."
                onClose={(confirmed) => {
                    setConfirmOpen(false);
                    if (confirmed) confirmAction();
                }}
            />
        </Box>
    );
};

export default CuentaPage;
