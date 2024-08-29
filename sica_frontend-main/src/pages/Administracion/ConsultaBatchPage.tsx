import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import { fetchSistemas, fetchModulos, saveBatchProcess } from '../../api/batchService';
import { useNotification } from '../../providers/NotificationProvider';
import ComboBox from '../../components/base/tabla/Combobox';

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

  const [sistemas, setSistemas] = useState<{ label: string; value: string }[]>([]);
  const [modulos, setModulos] = useState<{ label: string; value: string }[]>([]);
  const { notify } = useNotification();

  useEffect(() => {
    const loadSistemas = async () => {
      const sistemasData = await fetchSistemas();
      setSistemas([{ label: 'TODOS', value: '%' }, ...sistemasData]);
    };

    loadSistemas();
  }, []);

  useEffect(() => {
    const loadModulos = async () => {
      if (filtros.sistema) {
        const modulosData = await fetchModulos(filtros.sistema);
        setModulos([{ label: 'TODOS', value: '%' }, ...modulosData]);
      } else {
        setModulos([]);
      }
    };

    loadModulos();
  }, [filtros.sistema]);

  const handleFiltroChange = (name: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
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
              <ComboBox
                options={sistemas}
                onSelect={(value) => handleFiltroChange('sistema', value?.value || '')}
                label="Sistema"
                getOptionLabel={(option) => option.label}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ComboBox
                options={modulos}
                onSelect={(value) => handleFiltroChange('modulo', value?.value || '')}
                label="Módulo"
                getOptionLabel={(option) => option.label}
                disabled={!filtros.sistema}
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
