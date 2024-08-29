import React, { useState, useMemo } from 'react';
import { Box, Button, Grid } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '../../components/base/tabla/Combobox';
import { conciliacionesMock } from '../../mock/conciliacionesMock';
import ConciliacionTable from '../../components/base/tabla/ConciliacionTable';

const ConciliacionSaldosPage: React.FC = () => {
  const [filtros, setFiltros] = useState({
    sistema: '',
    modulo: '',
    fecha: '',
    oficina: '90',
    moneda: '1',
  });

  const handleFiltroChange = (name: string, value: string) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  // Memorizar la conciliación filtrada para evitar recalcular en cada render
  const conciliacionesFiltradas = useMemo(() => {
    return conciliacionesMock.filter((item) => {
      return (
        (filtros.sistema === '' || item.sistema === filtros.sistema) &&
        (filtros.modulo === '' || item.modulo === filtros.modulo) &&
        (filtros.fecha === '' || item.fecha === filtros.fecha) &&
        (filtros.oficina === '' || item.oficina === filtros.oficina) &&
        (filtros.moneda === '' || item.moneda === filtros.moneda)
      );
    });
  }, [filtros]);

  const handleExportModule = () => {
    // Implementar la lógica para exportar por módulo
    console.log('Generando archivo por módulo con filtros:', filtros);
  };

  const handleExportFile = () => {
    // Implementar la lógica para exportar por sistema
    console.log('Generando archivo por sistema con filtros:', filtros);
  };

  return (
    <Box>
      <BodyHeader
        headerRoute="Consultas / Conciliación de Saldos"
        TitlePage="Conciliación de Saldos"
        tooltipProps={{ title: "Consulta de Conciliación de Saldos" }}
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
            disabled={!filtros.sistema}  // Deshabilitar si no se ha seleccionado un sistema
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
      <ConciliacionTable data={conciliacionesFiltradas} />
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportModule}
          disabled={!conciliacionesFiltradas.length} // Deshabilitar si no hay datos filtrados
        >
          Generar Módulo
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExportFile}
          disabled={!conciliacionesFiltradas.length} // Deshabilitar si no hay datos filtrados
          sx={{ ml: 2 }}
        >
          Generar Archivo
        </Button>
      </Box>
    </Box>
  );
};

export default ConciliacionSaldosPage;
