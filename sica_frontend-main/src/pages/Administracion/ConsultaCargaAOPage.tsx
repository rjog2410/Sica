import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '../../components/base/tabla/Combobox';
import CargaAOTable from '../../components/base/tabla/CargaAOTable';
import { useNotification } from '../../providers/NotificationProvider';
import { Sistema } from '../../types';
import * as serviceSistema from '../Catalogos/selectores/serviceSelectorSistemas';
import * as serviceModulo from '../Catalogos/selectores/serviceSelectorModulos';
import * as serviceCargaAO from '../Administracion/selectores/selectorCargaAreaOperativa';
import { CargaAOData, FiltrosCargaAO } from '../../types';

import useAuthStore from '../../store/authStore'; //para permisos
import { useNavigate } from 'react-router-dom'; //para permisos
import * as serviceInfo from '@/pages/CommonServices/commonService';


const ConsultaCargaAOPage: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosCargaAO>({
    fecha_carga: '',
    sistema: '',
    modulo: '',
    fecha_operativa: '',
    tipoSalMov: '',
  });

  const [cargaData, setCargaData] = useState<CargaAOData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [modulos, setModulos] = useState<String[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string>('');
  const [selectedModulo, setSelectedModulo] = useState<string>('');
  const [infoData, setInfoData] = useState<string>('');
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  const { token } = useAuthStore();
  const requiredPermission = '/sica/administración/consulta-carga-ao';
  useEffect(() => {
    if (!hasPermission(requiredPermission)) {
      notify('No tienes permisos para acceder a esta página', 'error');
      navigate('/');
    }
  }, [hasPermission, navigate, notify]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await serviceInfo.getInfoPantalla(requiredPermission, token);
        setInfoData(data);

      } catch (error) {
        notify('Error al cargar los datos de la pantalla', 'error');
      }
    };

    getInfo();
  }, [notify]);

  const fetchData = async () => {
    try {
      const dataSist = await serviceSistema.fetchSistemas(token);
      if (!!dataSist && dataSist.length > 0) {
        //console.log("sistemas recuperados: ",dataSist);
        setSistemas(dataSist);
        // setSelectedSistema(dataSist[0].sis_clave);
        // handleFiltroChange('sistema', dataSist[0].sis_clave || '');
        // handleFiltroChange('modulo', '');
        // setSelectedModulo('');
        setModulos([]);
      } else {
        setSistemas([]);
        setModulos([]);
        // handleFiltroChange('sistema', '');
        // handleFiltroChange('modulo', '');
        setSelectedSistema('');
        setSelectedModulo('');
      }


    } catch (error) {
      notify('Error al cargar los datos de columnas', 'error');
    }
  };

  const fetchDataMOduloByClaveSistema = async () => {
    try {
      const dataModXSist = await serviceModulo.fetchModuloByClave(selectedSistema, token);
      if (!dataModXSist || dataModXSist.length == 0) {
        setModulos([]);
        setSelectedModulo('');
        // handleFiltroChange('modulo', '');
        notify('No existen módulos para sistema: ' + selectedSistema, 'info');
      } else {
        setModulos(Array.from(new Set(dataModXSist.map(obj => obj?.mod_clave))));
        setSelectedModulo('');
        handleFiltroChange('modulo', '');
        // handleFiltroChange('modulo',dataModXSist[0].mod_clave || '');
      }

    } catch (error) {
      notify('Error al cargar los datos de modulos para clave sistema: ' + selectedSistema, 'error');
    }
  };

  useEffect(() => {
    if (!!selectedSistema && selectedSistema !== '') {
      fetchDataMOduloByClaveSistema();
    } else {
      setModulos([]);
      setSelectedModulo('');
      handleFiltroChange('modulo', '');
    }
  }, [selectedSistema]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    handleFiltroChange('sistema', sistema || '');
    setSelectedModulo('');


  };

  const handleModuloSelect = (modulo: string | null) => {
    setSelectedModulo(modulo);
    handleFiltroChange('modulo', modulo || '');
  };

  const handleFiltroChange = (name: string, value: string) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultar = async () => {
    if (Object.values(filtros).every(val => val === '')) {
      notify('Debe ingresar al menos un parámetro de búsqueda.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const resp = await serviceCargaAO.fetchCargaAreaOperativa(filtros, token);
      if (resp?.status === 200) {
        setCargaData(resp.data);
        if (resp.data.length > 0) {
          notify(`Consulta realizada con éxito. ${resp.data.length} registros recuperados.`, 'success');
        } else {
          notify('No existe información para los criterios de búsqueda seleccionados.', 'info');
        }
      } else {
        setCargaData([]);
        notify(resp?.message || 'Error al consultar la carga de área operativa', 'info');
      }


    } catch (error) {
      notify('Error al obtener los datos de carga AO.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimpiar = () => {
    setFiltros({
      fecha_carga: '',
      sistema: '',
      modulo: '',
      fecha_operativa: '',
      tipoSalMov: '',
    });
    setSelectedSistema('');
    setCargaData([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box>
      <BodyHeader
        headerRoute="Consultas / Carga Área Operativa"
        TitlePage="Consulta de Carga AO"
        tooltipProps={{ title: infoData }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={[...Array.from(new Set(sistemas.map(sistema => sistema.sis_clave)))]}
            onChange={(_event, value) => handleSistemaSelect(value)}
            value={selectedSistema}
            renderInput={(params) => <TextField {...params} value={selectedSistema} label="Sistema" variant="outlined" />} // Aplicamos la propiedad sx a TextField
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={modulos}
            onChange={(_event, value) => handleModuloSelect(value)}
            disabled={selectedSistema === ''}
            value={selectedModulo}
            renderInput={(params) => <TextField {...params} label="Módulo" value={selectedModulo} variant="outlined" />} // Aplicamos la propiedad sx a TextField
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Fecha de Carga"
            type="date"
            name="fecha_carga"
            value={filtros.fecha_carga}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth

          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Fecha Operativa"
            type="date"
            name="fecha_operativa"
            value={filtros.fecha_operativa}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["S", "M"]}
            onSelect={(value) => handleFiltroChange('tipoSalMov', value || '')}
            label="Tipo de Conciliación"
            getOptionLabel={(option) => option}
          />
        </Grid>
      </Grid>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={handleConsultar} disabled={isLoading}>
          {isLoading ? 'Consultando...' : 'Consultar'}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleLimpiar} disabled={isLoading} sx={{ ml: 2 }}>
          Limpiar
        </Button>
      </Box>
      <CargaAOTable data={cargaData} />
    </Box>
  );
};

export default ConsultaCargaAOPage;
