import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ComboBox from '../../components/base/tabla/Combobox';
import CargaSIFTable from '../../components/base/tabla/CargaSIFTable';
import { fetchCargaSIFData } from './conciliacionServiceMock';
import { CargaSIFData } from './inteface';
import { useNotification } from '../../providers/NotificationProvider';

interface FiltrosCargaSIF {
  sistema: string;
  modulo: string;
  fechaConciliacion: string;
  fechaCarga: string;
  tipo: string;
}

const ConsultaCargaSIFPage: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosCargaSIF>({
    sistema: '',
    modulo: '',
    fechaConciliacion: '',
    fechaCarga: '',
    tipo: '',
  });

  const [cargaData, setCargaData] = useState<CargaSIFData[]>([]);
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
      const data = await fetchCargaSIFData(filtros);
      setCargaData(data);
    } catch (error) {
      notify('Error al obtener los datos de carga SIF.', 'error');
    } finally {
      setIsLoading(false);
    }
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
            onSelect={(value) => handleFiltroChange('fechaConciliacion', value || '')}
            label="Fecha Conciliación"
            getOptionLabel={(option) => option}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ComboBox
            options={["2024-08-01", "2024-08-02"]}
            onSelect={(value) => handleFiltroChange('fechaCarga', value || '')}
            label="Fecha Carga"
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleConsultar}
          disabled={isLoading}
        >
          {isLoading ? 'Consultando...' : 'Consultar'}
        </Button>
      </Box>
      <CargaSIFTable data={cargaData} />
    </Box>
  );
};

export default ConsultaCargaSIFPage;
