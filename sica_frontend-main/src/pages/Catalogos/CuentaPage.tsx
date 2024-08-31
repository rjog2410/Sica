import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import CuentasTable from '../../components/base/tabla/CuentasTable';
import ComboBox from '../../components/base/tabla/Combobox';
import { Cuenta, Regla } from '../../types';
import * as service from './selectores/serviceSelectorCuentaRegla';
import { useNotification } from '../../providers/NotificationProvider';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import AddCuentaModal from './modales/AddCuentaModal';

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
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [reglas, setReglas] = useState<Regla[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string | null>('ALL');
  const [selectedModulo, setSelectedModulo] = useState<string | null>('ALL');
  const [filteredCuentas, setFilteredCuentas] = useState<Cuenta[]>([]);
  const [modulos, setModulos] = useState<string[]>([]);
  const [isCuentaModalOpen, setIsCuentaModalOpen] = useState<boolean>(false); // Estado para el modal de cuentas
  const [editingCuenta, setEditingCuenta] = useState<Cuenta>(originalObject); // Estado para la cuenta que se está editando o agregando
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { notify } = useNotification();
  const tableRef = useRef<any>(null);

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
    if (selectedSistema && selectedSistema !== 'ALL') {
      // const modulosFiltrados = cuentas
      //   .filter(cuenta => cuenta.clave_sistema === selectedSistema)
      //   .map(cuenta => cuenta.clave_modulo);
      // setModulos(['ALL', ...Array.from(new Set(modulosFiltrados))]);
    } else {
      setModulos(['ALL']);
    }
  }, [selectedSistema, cuentas]);

  useEffect(() => {
    // setFilteredCuentas(
    //   cuentas.filter(cuenta => {
    //     const matchSistema = selectedSistema === 'ALL' || cuenta.clave_sistema === selectedSistema;
    //     const matchModulo = selectedModulo === 'ALL' || cuenta.clave_modulo === selectedModulo;
    //     return matchSistema && matchModulo;
    //   })
    // );
  }, [selectedSistema, selectedModulo, cuentas]);

  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    setSelectedModulo('ALL');
  };

  const handleModuloSelect = (modulo: string | null) => {
    setSelectedModulo(modulo);
  };

  const handleOpenCuentaModal = () => {
    setEditingCuenta(originalObject);
    setIsCuentaModalOpen(true);
  };

  const handleCloseCuentaModal = () => {
    setIsCuentaModalOpen(false);
    setEditingCuenta(originalObject);
  };

  const handleSaveCuenta = async (cuenta: Cuenta) => {
    try {
      await service.createOrUpdateCuentaRegla(cuenta);
      if (cuenta.cuc_clave) {
        setCuentas(cuentas.map(c => (c.cuc_clave === cuenta.cuc_clave ? cuenta : c)));
      } else {
        setCuentas([...cuentas, cuenta]);
      }
      notify('Cuenta guardada correctamente', 'success');
    } catch (error) {
      notify('Error al guardar la cuenta', 'error');
    }
    setIsCuentaModalOpen(false);
  };

  const handleEditCuenta = (cuenta: Cuenta) => {
    setEditingCuenta(cuenta);
    setIsCuentaModalOpen(true);
  };

  const handleViewRules = (id: number) => {
    // const cuentaSeleccionada = cuentas.find(cuenta => cuenta.id === id);
    //
    // if (!cuentaSeleccionada) {
    //   notify('Cuenta no encontrada', 'error');
    //   return;
    // }
    //
    // const reglasAsociadas = reglas.filter(regla => regla.clave_regla === cuentaSeleccionada.clave_regla);
    // setCurrentReglas(reglasAsociadas);
    // setIsSubpantallaOpen(true);
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
        notify('Error al eliminar la regla', 'error');
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
        headerRoute="Catálogos / Cuentas"
        TitlePage="Cuentas"
        tooltipProps={{ title: "Información sobre la Gestión de Cuentas" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Box mb={2}>
        <ComboBox
          // options={['ALL', ...Array.from(new Set(cuentas.map(cuenta => cuenta.clave_sistema)))]}
          options={['ALL']}
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
      <AddCuentaModal
        open={isCuentaModalOpen}
        onClose={handleCloseCuentaModal}
        onSave={handleSaveCuenta}
        initialData={editingCuenta}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        content="¿Estás seguro de que deseas eliminar esta cuenta? Esta acción no se puede deshacer."
        onClose={(confirmed) => {
          setConfirmOpen(false);
          if (confirmed) confirmAction();
        }}
      />
    </Box>
  );
};

export default CuentaPage;
