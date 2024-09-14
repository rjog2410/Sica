import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Button, Grid, Typography , TextField} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import {  saveBatchProcess } from '../../api/batchService';
import { useNotification } from '../../providers/NotificationProvider';
import ComboBox from '../../components/base/tabla/Combobox';
import {  Sistema } from '../../types';
import * as serviceSistema from '../Catalogos/selectores/serviceSelectorSistemas';
import * as serviceModulo from '../Catalogos/selectores/serviceSelectorModulos';

const ConsultaBatchPage: React.FC = () => {
  const [filtros, setFiltros] = useState({
    proceso: '',
    sistema: '',
    modulo: '',
    tipoInformacion: '',
    borrarInformacion: '',
    fechaInicio: '',
    fechaFin: '',
  });

  
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
      setSelectedModulo(dataModXSist[0].mod_clave);;
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

  const handleFiltroChange = (name: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    setSelectedModulo('');
     
  };

  const handleModuloSelect = (modulo: string | null) => {
    setSelectedModulo(modulo);
  };

  const handleGuardar = async () => {
    if (!filtros.proceso || !filtros.sistema || !filtros.modulo || !filtros.tipoInformacion || !filtros.fechaInicio || !filtros.fechaFin) {
      notify('Todos los campos son obligatorios', 'warning');
      return;
    }

    // Validaciones específicas para cada proceso
    if (filtros.proceso === 'SICAP001') {
      if (new Date(filtros.fechaFin) < new Date(filtros.fechaInicio)) {
        notify('La fecha final debe ser mayor o igual a la fecha de inicio.', 'warning');
        return;
      }
    } else if (filtros.proceso === 'SICAP002') {
      const startDate = new Date(filtros.fechaInicio);
      if (startDate.getDate() !== 1) {
        notify('La fecha inicial debe corresponder al primer día del mes.', 'warning');
        return;
      }
    }

    try {
      const response = await saveBatchProcess(filtros);
      if (response && response.success) {
        notify('Proceso Batch guardado correctamente', 'success');
      } else {
        notify('Error al guardar el proceso Batch', 'error');
      }
    } catch (error) {
      notify('Ocurrió un error al guardar el proceso Batch', 'error');
    }
  };

  return (
    <Box>
      <BodyHeader
        headerRoute="Administración / Parametrización de Procesos Batch"
        TitlePage="Consulta y Parametrización de Procesos Batch"
        tooltipProps={{ title: 'Parametriza los procesos Batch diarios' }}
        typographyPropsRoute={{ variant: 'h6' }}
        typographyPropsTitle={{ variant: 'h3' }}
      />
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6}>
          <ComboBox
            options={[
              { label: 'Traductor (SICAP001)', value: 'SICAP001' },
              { label: 'Extractor SIF (SICAP002)', value: 'SICAP002' },
              { label: 'Transportador SIRAC-SICA (SICAP004)', value: 'SICAP004' },
            ]}
            onSelect={(value) => handleFiltroChange('proceso', value?.value || '')}
            label="Proceso"
            getOptionLabel={(option) => option.label}
          />
        </Grid>
        {filtros.proceso !== 'SICAP004' && (
          <>
            <Grid item xs={12} sm={6}>
            <Autocomplete
                    options={[...Array.from(new Set(sistemas.map(sistema => sistema.sis_clave)))]}
                    onChange={(_event, value) => handleSistemaSelect(value)}
                    value = {selectedSistema}
                    renderInput={(params) => <TextField {...params} value={selectedSistema} label="Sistema" variant="outlined" />} // Aplicamos la propiedad sx a TextField
                />
            </Grid>
            <Grid item xs={12} sm={6}>
            <Autocomplete
                    options={modulos}
                    onChange={(_event, value) => handleModuloSelect(value)}
                    disabled={selectedSistema === ''}
                    value = {selectedModulo}
                    renderInput={(params) => <TextField {...params} label="Módulo" value={selectedModulo} variant="outlined" />} // Aplicamos la propiedad sx a TextField
                />
            </Grid>
          </>
        )}
        {filtros.proceso !== 'SICAP004' && (
          <>
            <Grid item xs={12} sm={6}>
              <ComboBox
                options={[
                  { label: 'Saldos', value: 'S' },
                  { label: 'Movimientos', value: 'M' },
                ]}
                onSelect={(value) => handleFiltroChange('tipoInformacion', value?.value || '')}
                label="Tipo de Información"
                getOptionLabel={(option) => option.label}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ComboBox
                options={[
                  { label: 'Sí', value: 'S' },
                  { label: 'No', value: 'N' },
                ]}
                onSelect={(value) => handleFiltroChange('borrarInformacion', value?.value || '')}
                label="Borrar Información"
                getOptionLabel={(option) => option.label}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6}>
          <Typography>Fecha de Inicio</Typography>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Fecha de Fin</Typography>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleGuardar}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default ConsultaBatchPage;
