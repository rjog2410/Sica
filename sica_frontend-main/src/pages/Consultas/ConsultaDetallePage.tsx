// src/pages/Consultas/ConsultaDetallePage.tsx
import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '../../components/base/tabla/Combobox';
import { TituloColumna, DetalleCuentaConsultas } from '../../types';
import DynamicTable from '../../components/base/tabla/DynamicTable';
import { fetchDetallePorCuenta, fetchTituloColumnas } from '../../mock/conciliacionServicesMock';

const ConsultaDetallePorCuentaPage: React.FC = () => {
  const [filtros, setFiltros] = useState({
    sistema: '',
    modulo: '',
    fecha: '',
    oficina: '90',
    moneda: '1',
  });
  const [columnas, setColumnas] = useState<TituloColumna[]>([]);
  const [detalle, setDetalle] = useState<DetalleCuentaConsultas[]>([]);

  const handleFiltroChange = (name: string, value: string) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleConsulta = async () => {
    const columnasData = await fetchTituloColumnas(filtros.sistema, filtros.modulo);
    setColumnas(columnasData);

    const detalleData = await fetchDetallePorCuenta(filtros);
    setDetalle(detalleData);
  };

  return (
    <Box>
      <BodyHeader
        headerRoute="Consultas / Detalle Por Cuenta"
        TitlePage="Detalle Por Cuenta"
        tooltipProps={{ title: "Consulta de Detalle Por Cuenta Contable" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["SIF", "Sistema2"]}
            onSelect={(value) => handleFiltroChange('sistema', value || '')}
            label="Sistema"
            getOptionLabel={(option) => option}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["MOD1", "MOD2"]}
            onSelect={(value) => handleFiltroChange('modulo', value || '')}
            label="Módulo"
            getOptionLabel={(option) => option}
            disabled={!filtros.sistema}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["2024-08-01", "2024-08-02"]}
            onSelect={(value) => handleFiltroChange('fecha', value || '')}
            label="Fecha"
            getOptionLabel={(option) => option}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["90", "91"]}
            onSelect={(value) => handleFiltroChange('oficina', value || '')}
            label="Oficina"
            getOptionLabel={(option) => option}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["1", "2"]}
            onSelect={(value) => handleFiltroChange('moneda', value || '')}
            label="Moneda"
            getOptionLabel={(option) => option}
          />
        </Grid>
      </Grid>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={handleConsulta}>
          Consultar
        </Button>
      </Box>
      <DynamicTable columnas={columnas} data={detalle} />
      <Box mt={2}>
        <Button variant="contained" color="secondary">
          Exportar a Excel
        </Button>
      </Box>
    </Box>
  );
};

export default ConsultaDetallePorCuentaPage;
