import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '../../components/base/tabla/Combobox';
import CargaAOTable from '../../components/base/tabla/CargaAOTable';
import { fetchCargaAOData } from '../../mock/aoServiceMock';
import { useNotification } from '../../providers/NotificationProvider';

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
          <ComboBox
            options={["2024-08-01", "2024-08-02"]}
            onSelect={(value) => handleFiltroChange('fechaCarga', value || '')}
            label="Fecha de Carga"
            getOptionLabel={(option) => option}
          />
        </Grid>
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
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["2024-08-01", "2024-08-02"]}
            onSelect={(value) => handleFiltroChange('fechaOperativa', value || '')}
            label="Fecha Operativa"
            getOptionLabel={(option) => option}
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
