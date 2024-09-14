import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Button, Grid , TextField} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '../../components/base/tabla/Combobox';
import CargaAOTable from '../../components/base/tabla/CargaAOTable';
import { useNotification } from '../../providers/NotificationProvider';
import {  Sistema } from '../../types';
import * as serviceSistema from '../Catalogos/selectores/serviceSelectorSistemas';
import * as serviceModulo from '../Catalogos/selectores/serviceSelectorModulos';
import * as serviceCargaAO from '../Administracion/selectores/selectorCargaAreaOperativa';

interface CargaAOData {
  data: {
    RegistrosCargados: number;
    RegistrosConciliados: number;
    fecha_informacion: string;
    mod_sis_clave: string;
    tipo_salmov: string;
    mod_clave: string;
    fecha_carga: string;
  }[];
}

interface FiltrosCargaAO {
  fecha_carga: string;
  sistema: string;
  modulo: string;
  fecha_operativa: string;
  tipoSalMov: string;
}

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

  const fetchData = async () => {
    try {
    const dataSist= await serviceSistema.fetchSistemas();
    if(!!dataSist && dataSist.length>0){
      //console.log("sistemas recuperados: ",dataSist);
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
      serviceCargaAO.fetchCargaAreaOperativa(filtros).then(resp => {
        console.log("respuesta: ",resp);
        if(!!resp && resp.status == 200){
          setCargaData(resp?.data);
          notify('Consulta realizada con éxito', 'success');
        }else{
          setCargaData([]);
          notify((!!resp && !!resp.message ? resp.message : 'Error al consultar la carga de área operativa'), 'info');
        }
        
       
      }).catch(error=>{
        console.error('Error al consultar los datos de craga area operativa', error);
        notify('Error al consultar los datos de craga area operativa' , 'error');
      });
     
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
        tooltipProps={{ title: "Consulta los registros cargados y conciliados" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Grid container spacing={2} mb={2}>
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
