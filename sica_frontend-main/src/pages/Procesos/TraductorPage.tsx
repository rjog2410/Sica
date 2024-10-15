import React, { useEffect, useState } from 'react';
import { Box, Button, Select, MenuItem, TextField, FormControl, InputLabel } from '@mui/material';
import { sistemasMock, modulosMock } from './serviceSelectorTraductor';
import * as service from './serviceSelectorTraductor';
import { Modulo, TraductorParams } from '../../types';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNotification } from '../../providers/NotificationProvider';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '@/components/base/tabla/Combobox';

import useAuthStore from '../../store/authStore'; //para permisos
import { useNavigate } from 'react-router-dom'; //para permisos
import * as serviceInfo from '@/pages/CommonServices/commonService';
const TraductorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [infoData, setInfoData] = useState<string>('');

  const originalObject = {
    sistema: 'TODOS',
    modulo: '',
    tipo_informacion: '',
    fecha_inicial: '',
    fecha_final: '',
  }
  const [params, setParams] = useState<TraductorParams>({
    sistema: '',
    modulo: '',
    tipo_informacion: '',
    fecha_inicial: '',
    fecha_final: '',
  });

  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string | null>('TODOS');
  const [secondFilterOptions, setSecondFilterOptions] = useState<string[]>([]);
  const [selectedModulo, setSelectedModulo] = useState<string>('TODOS');

  const [filterValue, setFilterValue] = useState<string>('TODOS');


  const { notify } = useNotification();
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  const { token } = useAuthStore();
  const requiredPermission = '/sica/procesos/traductor';
  useEffect(() => {
    if (!hasPermission(requiredPermission)) {
      notify('No tienes permisos para acceder a esta página', 'error');
      navigate('/');
    }
  }, [hasPermission, navigate, notify]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await service.fetchModulos(token);
        setModulos(data);
        notify('Datos de Traductor Cargados', 'info');
      } catch (error) {
        notify('Error al cargar los datos de Traductor', 'error');
      }
    };

    fetchData();
  }, [notify]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await serviceInfo.getInfoPantalla(requiredPermission, token);
        setInfoData(data);

      } catch (error) {
        notify('Error al cargar los datos de sistemas', 'error');
      }
    };

    getInfo();
  }, [notify]);

  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    if (sistema && sistema !== 'TODOS') {
      const filteredModules = modulos.filter(m => m.clave_sistema === sistema);
      const newOptions = ['TODOS', ...new Set(filteredModules.map(m => m.clave_modulo))];
      params.sistema = sistema;
      setSecondFilterOptions(newOptions);
      setSelectedModulo('TODOS');
    } else {
      setSecondFilterOptions([]);
      setSelectedModulo('TODOS');
    }
  };

  const handleModuloSelect = (modulo: string | null) => {

    params.modulo = modulo;
    setSelectedModulo(modulo || 'TODOS');
    setFilterValue(modulo ? modulo : 'TODOS');

  };

  const filteredModulos = modulos.filter(modulo => {
    const matchSistema = selectedSistema === 'TODOS' || modulo.clave_sistema === selectedSistema;
    const matchModulo = selectedModulo === 'TODOS' || modulo.clave_modulo === selectedModulo;
    return matchSistema && matchModulo;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const validateParams = (): boolean => {


    if (params.fecha_final < params.fecha_inicial) {
      notify('La fecha final debe ser mayor o igual a la fecha de inicio', 'error');
      return false;
    }
    return true;
  };

  const handleExecute = async () => {
    if (!validateParams()) {

      return;
    }
    setIsLoading(true);
    try {
      await service.executeTraductor(params, token).then(resp => {
        if (resp.status === 200) {

          notify('Traductor ejecutado correctamente', 'success');

          setParams(originalObject);

        } else {
          notify(resp.message, 'warning');
          console.log("ocurrio un error: ", resp.message);
        }
      }).catch(error => {
        notify(error.response.data.message, 'error');
        console.log("ocurrio un error", error.response.data.message);
      })
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && (error as any).response?.status === 404) {
        notify('Datos no encontrados.', 'error');
      } else if (error instanceof Error) {
        notify(`Error: ${error.message}`, 'error');
      } else {
        notify('Error desconocido al generar el reporte', 'error');
      }
    } finally {
      setIsLoading(false);
    }

  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setParams((prev) => ({
      ...prev,
      [name!]: value === 'TODOS' ? '%' : value, // Asignamos "%" si selecciona "TODOS"
    }));
  };


  return (

    <Box sx={{ p: 3 }}>
      <BodyHeader
        headerRoute="Procesos / Traductor"
        TitlePage="Traductor"
        tooltipProps={{ title: infoData }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Box mb={2}>
        <ComboBox
          options={['TODOS', ...Array.from(new Set(modulos.map(modulo => modulo.clave_sistema)))]}
          onSelect={handleSistemaSelect}
          label="Seleccione un Sistema"
          getOptionLabel={(option: string) => option}
        />
      </Box>
      <Box mb={2}>
        <ComboBox
          options={secondFilterOptions}
          onSelect={handleModuloSelect}
          label="Filtrar por Clave de Módulo"
          getOptionLabel={(option: string) => option}
          disabled={selectedSistema === 'TODOS' || secondFilterOptions.length === 0}
        />
      </Box>
      <Box mb={2}>
        <TextField
          select
          label="Tipo Información"
          name="tipo_informacion"
          value={params.tipo_informacion}
          onChange={handleSelectChange}
          fullWidth
        >
          <MenuItem value="S">Saldos</MenuItem>
          <MenuItem value="M">Movimientos</MenuItem>
        </TextField>
      </Box>
      <Box mb={2}>
        <TextField
          label="Fecha Inicio"
          type="date"
          name="fecha_inicial"
          value={params.fecha_inicial}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Fecha Fin"
          type="date"
          name="fecha_final"
          value={params.fecha_final}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />

      </Box>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExecute}
          disabled={isLoading}
        >
          {isLoading ? 'Ejecutando...' : 'Ejecutar'}
        </Button>
      </Box>
    </Box>
  );
};
export default TraductorPage;
