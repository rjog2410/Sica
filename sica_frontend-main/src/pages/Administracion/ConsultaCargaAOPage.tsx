import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Button, Grid , TextField, Typography} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '../../components/base/tabla/Combobox';
import CargaAOTable from '../../components/base/tabla/CargaAOTable';
import { fetchCargaAOData } from '../../mock/aoServiceMock';
import { useNotification } from '../../providers/NotificationProvider';
import {  Sistema } from '../../types';
import * as serviceSistema from '../Catalogos/selectores/serviceSelectorSistemas';
import * as serviceModulo from '../Catalogos/selectores/serviceSelectorModulos';

interface CargaAOData {
  fechaCarga: string;
  sistema: string;
  modulo: string;
  fechaOperativa: string;
  tipoConciliacion: string;
  registrosCargados: number;
  registrosConciliados: number;
}

interface FiltrosCargaAO {
  fechaCarga: string;
  sistema: string;
  modulo: string;
  fechaOperativa: string;
  tipo: string;
}

const ConsultaCargaAOPage: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosCargaAO>({
    fechaCarga: '',
    sistema: '',
    modulo: '',
    fechaOperativa: '',
    tipo: '',
  });

  const [cargaData, setCargaData] = useState<CargaAOData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();
  const [sistemas, setSistemas] = useState<Sistema[]>([]); 
  const [modulos, setModulos] = useState<String[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string>('');
  const [selectedModulo, setSelectedModulo] = useState<string>('');

  const fetchData = async () => {
    try {
    const dataSist= await serviceSistema.fetchSistemas();
    if(!!dataSist && dataSist.length>0){
      console.log("sistemas recuperados: ",dataSist);
      setSistemas(dataSist);
      setSelectedSistema(dataSist[0].sis_clave);
      handleFiltroChange('sistema', dataSist[0].sis_clave || '');
      handleFiltroChange('modulo', '');
      setSelectedModulo('');
      setModulos([]);
    }else{
      setSistemas([]);
      setModulos([]);
      handleFiltroChange('sistema', '');
      handleFiltroChange('modulo', '');
      setSelectedSistema('');
      setSelectedModulo('');
    }
    
   
    } catch (error) {
      console.error('Error al cargar los datos de sistemas:', error);
      notify('Error al cargar los datos de columnas', 'error');
    }
  };

  const fetchDataMOduloByClaveSistema = async () => {
    try {
    const dataModXSist= await serviceModulo.fetchModuloByClave(selectedSistema);
    if(!dataModXSist || dataModXSist.length == 0 ){
      setModulos([]);
      setSelectedModulo('');
      handleFiltroChange('modulo', '');
      notify('No existen módulos para sistema: '+selectedSistema, 'info');
    }else{
      setModulos(Array.from(new Set(dataModXSist.map(obj => obj?.mod_clave))));
      setSelectedModulo(dataModXSist[0].mod_clave);
      handleFiltroChange('modulo',dataModXSist[0].mod_clave || '');
    }
   
    } catch (error) {
      console.error('Error al cargar los datos de modulos para sistema: '+selectedSistema, error);
      notify('Error al cargar los datos de modulos para clave sistema: '+selectedSistema, 'error');
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
      const data = await fetchCargaAOData(filtros);
      setCargaData(data);
      notify('Consulta realizada con éxito', 'success');
    } catch (error) {
      notify('Error al obtener los datos de carga AO.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimpiar = () => {
    setFiltros({
      fechaCarga: '',
      sistema: '',
      modulo: '',
      fechaOperativa: '',
      tipo: '',
    });
    setSelectedSistema('');
    setCargaData([]);
  };

  return (
    <Box>
      <BodyHeader
        headerRoute="Consultas / Carga Área Operativa"
        TitlePage="Consulta de Carga AO"
        tooltipProps={{ title: "Consulta los registros cargados y conciliados" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>          
          <Typography>Fecha de Carga</Typography>
          <input
            type="date"
            value={filtros.fechaCarga}
            onChange={(e) => handleFiltroChange('fechaCarga', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
        <Autocomplete
                    options={[...Array.from(new Set(sistemas.map(sistema => sistema.sis_clave)))]}
                    onChange={(_event, value) => handleSistemaSelect(value)}
                    value = {selectedSistema}
                    renderInput={(params) => <TextField {...params} value={selectedSistema} label="Sistema" variant="outlined" />} // Aplicamos la propiedad sx a TextField
                />
        </Grid>
        <Grid item xs={12} sm={4}>
        <Autocomplete
                    options={modulos}
                    onChange={(_event, value) =>  handleModuloSelect(value)}
                    disabled={selectedSistema === ''}
                    value = {selectedModulo}
                    renderInput={(params) => <TextField {...params} label="Módulo" value={selectedModulo} variant="outlined" />} // Aplicamos la propiedad sx a TextField
                />
        </Grid>
        <Grid item xs={12} sm={4}>
        <Typography>Fecha Operativa</Typography>
          <input
            type="date"
            value={filtros.fechaOperativa}
            onChange={(e) => handleFiltroChange('fechaOperativa', e.target.value)}
          />          
        </Grid>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["S", "M"]}
            onSelect={(value) => handleFiltroChange('tipo', value || '')}
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
