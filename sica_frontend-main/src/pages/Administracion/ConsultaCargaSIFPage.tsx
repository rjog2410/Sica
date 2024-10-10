import React, { useState, useEffect } from 'react';
import {  Autocomplete, Box, Button, Grid , TextField } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '../../components/base/tabla/Combobox';
import CargaSIFTable from '../../components/base/tabla/CargaSIFTable';
import { CargaSIFData, FiltrosCargaSIF } from '../../types';
import { useNotification } from '../../providers/NotificationProvider';
import {  Sistema } from '../../types';
import * as serviceSistema from '../Catalogos/selectores/serviceSelectorSistemas';
import * as serviceModulo from '../Catalogos/selectores/serviceSelectorModulos';
import * as serviceCargaSIF from '../Administracion/selectores/selectorCargaSIF';

import useAuthStore from '../../store/authStore'; //para permisos
import { useNavigate } from 'react-router-dom'; //para permisos


const ConsultaCargaSIFPage: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosCargaSIF>({
    sistema: '',
    modulo: '',
    fecha_informacion: '',
    fecha_carga: '',
    tipo_salmov: '',
  });

  const [cargaData, setCargaData] = useState<CargaSIFData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();
  const [sistemas, setSistemas] = useState<Sistema[]>([]); 
  const [modulos, setModulos] = useState<String[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string>('');
  const [selectedModulo, setSelectedModulo] = useState<string>('');

  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  console.log(hasPermission);
  const requiredPermission = '/sica/administración/consulta-carga-sif';
  useEffect(() => {
      if (!hasPermission(requiredPermission)) {
          notify('No tienes permisos para acceder a esta página', 'error');
          navigate('/');
      }
  }, [hasPermission, navigate, notify]);

  const fetchData = async () => {
    try {
    const dataSist= await serviceSistema.fetchSistemas();
    if(!!dataSist && dataSist.length>0){
      console.log("sistemas recuperados: ",dataSist);
      setSistemas(dataSist);
      // setSelectedSistema(dataSist[0].sis_clave);
      setSelectedModulo('');
      setModulos([]);
    }else{
      setSistemas([]);
      setModulos([]);
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
      notify('No existen módulos para sistema: '+selectedSistema, 'info');
    }else{
      setModulos(Array.from(new Set(dataModXSist.map(obj => obj?.mod_clave))));
      handleFiltroChange('modulo', '');
      // setSelectedModulo(dataModXSist[0].mod_clave);
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
      // serviceCargaSIF.fetchCargaSIF(filtros).then(resp => {
      //   console.log("respuesta: ",resp);
      //   if(!!resp && resp.status == 200){
      //     setCargaData(resp?.data);
      //     if(resp?.data.length>0){
      //       notify('Consulta realizada con éxito. '+resp?.data.length +' registros recuperados.' , 'success');
      //     }else{
      //       notify('No existe información para los criterios de búsqueda seleccionados.', 'info');
      //     }
          
      //   }else{
      //     setCargaData([]);
      //     notify((!!resp && !!resp.message ? resp.message : 'Error al consultar los datos de carga SIF'), 'info');
      //   }
        
       
      // }).catch(error=>{
      //   console.error('Error al consultar los datos de carga SIF', error);
      //   notify('Error al consultar los datos de carga SIF' , 'error');
      // });

      const resp = await serviceCargaSIF.fetchCargaSIF(filtros);
      console.log("respuesta: ", resp);
  
      if (resp?.status === 200) {
        setCargaData(resp.data);
        if (resp.data.length > 0) {
          notify(`Consulta realizada con éxito. ${resp.data.length} registros recuperados.`, 'success');
        } else {
          notify('No existe información para los criterios de búsqueda seleccionados.', 'info');
        }
      } else {
        setCargaData([]);
        notify(resp?.message || 'Error al consultar los datos de carga SIF', 'info');
      }
    } catch (error) {
      notify('Error al obtener los datos de carga SIF.', 'error');
    } finally {
      setIsLoading(false);
    }
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
        headerRoute="Consultas / Carga SIF"
        TitlePage="Consulta de Carga SIF"
        tooltipProps={{ title: "Consulta los registros cargados en SIF" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Grid container spacing={2} mb={2}>
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
                    onChange={(_event, value) => handleModuloSelect(value)}
                    disabled={selectedSistema === ''}
                    value = {selectedModulo}
                    renderInput={(params) => <TextField {...params} label="Módulo" value={selectedModulo} variant="outlined" />} // Aplicamos la propiedad sx a TextField
                />
        </Grid>
        <Grid item xs={12} sm={4}>
        <TextField
            label="Fecha Conciliación"
            type="date"
            name="fecha_informacion"
            value={filtros.fecha_informacion}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth   
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
          <ComboBox
            options={["S", "M"]}
            onSelect={(value) => handleFiltroChange('tipo_salmov', value || '')}
            label="Tipo de Conciliación"
            getOptionLabel={(option) => option}
          />
        </Grid>
      </Grid>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConsultar}
          disabled={isLoading}
        >
          {isLoading ? 'Consultando...' : 'Consultar'}
        </Button>
      </Box>
      <CargaSIFTable data={cargaData} tipo_salmov={filtros?.tipo_salmov} />
    </Box>
  );
};

export default ConsultaCargaSIFPage;
