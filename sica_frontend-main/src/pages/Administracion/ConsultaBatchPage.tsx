import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import { saveBatchProcess } from '../../api/batchService';
import { useNotification } from '../../providers/NotificationProvider';
import ComboBox from '../../components/base/tabla/Combobox';
import { Sistema } from '../../types';
import * as serviceSistema from '../Catalogos/selectores/serviceSelectorSistemas';
import * as serviceModulo from '../Catalogos/selectores/serviceSelectorModulos';
import { FiltrosConsultaBatch } from '../../types';
import * as serviceConsultaBatch from '../Administracion/selectores/selectorConsultaBatch';

import useAuthStore from '../../store/authStore'; //para permisos
import { useNavigate } from 'react-router-dom'; //para permisos
import * as serviceInfo from '@/pages/CommonServices/commonService';


const ConsultaBatchPage: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosConsultaBatch>({
    proceso: '',
    sistema: '',
    modulo: '',
    tipo_informacion: '',
    borrar: '',
    fecha_ini: '',
    fecha_fin: '',
  });


  const { notify } = useNotification();
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [modulos, setModulos] = useState<String[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string>('');
  const [selectedModulo, setSelectedModulo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [infoData, setInfoData] = useState<string>('');
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  const { token } = useAuthStore();
  const requiredPermission = '/sica/administración/consulta-bach';
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
        console.log("sistemas recuperados: ", dataSist);
        // setSistemas(dataSist);
        const sistemasConTodos = [{ sis_clave: 'TODOS', sis_nombre: 'Todos los sistemas' }, ...dataSist];
        setSistemas(sistemasConTodos);
        setSelectedModulo('');
        setModulos([]);
      } else {
        handleFiltroChange('sistema', '');
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
      const dataModXSist = await serviceModulo.fetchModuloByClave(selectedSistema,token);
      if (!dataModXSist || dataModXSist.length == 0) {
        setModulos([]);
        setSelectedModulo('');
        handleFiltroChange('modulo', '');
        notify('No existen módulos para sistema: ' + selectedSistema, 'info');
      } else {
        // setModulos(Array.from('TODOS', ...new Set(dataModXSist.map(obj => obj?.mod_clave))));
        const modulosConTodos = ['TODOS', ...new Set(dataModXSist.map((obj) => obj?.mod_clave))];
        setModulos(modulosConTodos);
      }

    } catch (error) {
      console.error('Error al cargar los datos de modulos para sistema: ' + selectedSistema, error);
      notify('Error al cargar los datos de modulos para clave sistema: ' + selectedSistema, 'error');
    }
  };

  useEffect(() => {
    if (!!selectedSistema && selectedSistema !== '' && selectedSistema != "TODOS") {
      fetchDataMOduloByClaveSistema();
    } else {
      setModulos(['TODOS']);
      setSelectedModulo('TODOS');
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
    handleFiltroChange('modulo', '');
    handleFiltroChange('sistema', sistema || '');

  };

  const handleModuloSelect = (modulo: string | null) => {
    setSelectedModulo(modulo);
    handleFiltroChange('modulo', modulo || '');
  };

  const handleGuardar = async () => {
    console.log('filtros: ', filtros);

    if (filtros.proceso === 'SICAP004') {
      if (!filtros.proceso || !filtros.fecha_ini || !filtros.fecha_fin) {
        notify('Todos los campos son obligatorios', 'warning');
        return;
      }
    } else {
      if (!filtros.proceso || !filtros.borrar || !filtros.tipo_informacion || !filtros.fecha_ini || !filtros.fecha_fin) {
        notify('Todos los campos son obligatorios', 'warning');
        return;
      }
    }

    if (!!filtros.fecha_ini && !!filtros.fecha_fin && filtros.fecha_fin !== '' && filtros.fecha_ini !== '') {
      if (new Date(filtros.fecha_fin) < new Date(filtros.fecha_ini)) {
        notify('La fecha de termino debe ser mayor o igual a la fecha de inicio.', 'warning');
        return;
      }
    };

    // Validaciones específicas para cada proceso



    setIsLoading(true);
    try {
      serviceConsultaBatch.saveBatchProcess(filtros,token).then(resp => {
        console.log("respuesta: ", resp);
        if (!!resp && resp.status == 200) {
          notify('Proceso Batch ' + filtros.proceso + ' guardado correctamente.', 'success');
        } else {
          notify((!!resp && !!resp.message ? resp.message : 'Error al guardar el proceso batch ' + filtros.proceso + '.'), 'warning');
        }
      }).catch(error => {
        console.error('Error al guardar el proceso batch ' + filtros.proceso + '.', error);
        notify('Error al guardar el proceso batch ' + filtros.proceso + '.', 'error');
      });
    } catch (error) {
      notify('Error al guardar el proceso batch ' + filtros.proceso + '.', 'error');
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
        headerRoute="Administración / Parametrización de Procesos Batch"
        TitlePage="Parametrización de Procesos Batch"
        tooltipProps={{ title: infoData }}
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
                value={selectedSistema}
                renderInput={(params) => <TextField {...params} value={selectedSistema} label="Sistema" variant="outlined" />} // Aplicamos la propiedad sx a TextField
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={modulos}
                onChange={(_event, value) => handleModuloSelect(value)}
                disabled={selectedSistema === ''}
                value={selectedModulo}
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
                onSelect={(value) => handleFiltroChange('tipo_informacion', value?.value || '')}
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
                onSelect={(value) => handleFiltroChange('borrar', value?.value || '')}
                label="Borrar Información"
                getOptionLabel={(option) => option.label}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha de Inicio"
            type="date"
            name="fecha_ini"
            value={filtros.fecha_ini}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha de Termino"
            type="date"
            name="fecha_fin"
            value={filtros.fecha_fin}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
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
