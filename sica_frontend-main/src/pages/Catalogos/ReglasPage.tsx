import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ReglasTable from '../../components/base/tabla/ReglasTable';
import ComboBox from '../../components/base/tabla/Combobox';
import { Regla } from '../../types';
import * as service from './selectores/serviceSelectorCuentaRegla';
import { useNotification } from '../../providers/NotificationProvider';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import AddReglaModal from './modales/AddCuentaRegla';
import ReglasSubpantallaModal from './modales/ReglasSubpantallaModal';
import useAuthStore from '../../store/authStore'; //para permisos
const CuentaReglaPage: React.FC = () => {
    const originalObject: Regla = {
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

    const [reglas, setReglas] = useState<Regla[]>([]);
    const [selectedSistema, setSelectedSistema] = useState<string | null>('TODOS');
    const [selectedModulo, setSelectedModulo] = useState<string | null>('TODOS');
    const [modulos, setModulos] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubpantallaOpen, setIsSubpantallaOpen] = useState<boolean>(false); // Estado para la subpantalla de reglas
    const [editingRegla, setEditingRegla] = useState<Regla | null>(originalObject);
    const [currentReglas, setCurrentReglas] = useState<Regla[]>([]); // Estado para las reglas asociadas a una cuenta
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { notify } = useNotification();
    const tableRef = useRef<any>(null);
    const { token } = useAuthStore();
    useEffect(() => {
        const fetchData = async () => {
            try {
                // get reglas
            } catch (error) {
                // console.error('Error al cargar los datos de cuentas:', error);
                notify('Error al cargar los datos de cuentas', 'error');
            }
        };
        fetchData();
    }, [notify]);

    useEffect(() => {
        if (selectedSistema && selectedSistema !== 'TODOS') {
            //filtros
        } else {
            setModulos(['TODOS']);
        }
    }, [selectedSistema]);

    useEffect(() => {
        // setFilteredCuentas(
        //   cuentas.filter(cuenta => {
        //     const matchSistema = selectedSistema === 'TODOS' || cuenta.clave_sistema === selectedSistema;
        //     const matchModulo = selectedModulo === 'TODOS' || cuenta.clave_modulo === selectedModulo;
        //     return matchSistema && matchModulo;
        //   })
        // );
    }, [selectedSistema, selectedModulo]);

    const handleSistemaSelect = (sistema: string | null) => {
        setSelectedSistema(sistema);
        setSelectedModulo('TODOS');
    };

    const handleModuloSelect = (modulo: string | null) => {
        setSelectedModulo(modulo);
    };

    const handleOpenModal = () => {
        setEditingRegla(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveRegla = async (newRegla: Regla) => {
        try {
            if (editingRegla) {
                await service.createOrUpdateRegla(newRegla, true,token);
                setReglas(reglas.map((regla) =>
                    regla.reg_cuc_clave === editingRegla.reg_cuc_clave ? newRegla : regla
                ));
                notify('Regla actualizada correctamente', 'success');
            } else {
                await service.createOrUpdateRegla(newRegla, false,token);
                setReglas([...reglas, newRegla]);
                notify('Regla agregada correctamente', 'success');
            }
        } catch (error) {
            notify('No es posible guardar el registro.', 'error');
        }
        handleCloseModal();
    };

    const handleDeleteRegla = (id: number) => {
        const reglaToDelete = reglas.find(regla => regla.reg_cuc_clave === id);

        if (!reglaToDelete) {
            notify('Regla no encontrada', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                // await service.removeRegla(reglaToDelete.id);
                setReglas(reglas.filter((regla) => regla.reg_cuc_clave !== id));
                notify('Regla eliminada correctamente', 'success');
            } catch (error) {
                notify('No es posible eliminar el registro.', 'error');
            }
        });
        setConfirmOpen(true);
    };

    const handleDeleteMultiple = (ids: number[]) => {
        const reglasToDelete = reglas.filter(regla => ids.includes(regla.reg_cuc_clave));

        if (reglasToDelete.length === 0) {
            notify('No se encontraron reglas para eliminar', 'error');
            return;
        }

        setConfirmAction(() => async () => {
            try {
                // await service.removeMultipleReglas(ids);
                setReglas(reglas.filter(regla => !ids.includes(regla.reg_cuc_clave)));
                notify('Reglas eliminadas correctamente', 'success');
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
                headerRoute="Catálogos / Reglas"
                TitlePage="Reglas"
                tooltipProps={{ title: "Información sobre la Gestión de Reglas" }}
                typographyPropsRoute={{ variant: "h6" }}
                typographyPropsTitle={{ variant: "h3" }}
            />
            <Box mb={2}>
                <ComboBox
                    // options={['TODOS', ...Array.from(new Set(cuentas.map(cuenta => cuenta.clave_sistema)))]}
                    options={['TODOS']}
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
                    disabled={selectedSistema === 'TODOS'}
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
            <ReglasTable
                data={currentReglas}
                onUpdateRegla={handleSaveRegla}
                onDeleteRegla={handleDeleteRegla}
                onSelectionChange={setSelectedIds}
            />
            <AddReglaModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRegla}
                initialData={editingRegla}
            />
            <ReglasSubpantallaModal
                open={isSubpantallaOpen}
                onClose={() => setIsSubpantallaOpen(false)}
                reglas={currentReglas}
                onSaveRegla={handleSaveRegla}
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

export default CuentaReglaPage;
