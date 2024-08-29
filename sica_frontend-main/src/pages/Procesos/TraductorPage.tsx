import React, { useState } from 'react';
import { Box, Button, Select, MenuItem, TextField, FormControl, InputLabel } from '@mui/material';
import { sistemasMock, modulosMock } from './serviceSelectorTraductor';
import * as service from './serviceSelectorTraductor';
import { TraductorParams } from '../../types';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNotification } from '../../providers/NotificationProvider';
import BodyHeader from '../../components/base/BodyHeader';

const TraductorPage: React.FC = () => {
  const [params, setParams] = useState<TraductorParams>({
    sistema: '',
    modulo: '',
    fechaInicio: '',
    fechaFin: '',
    tipoInformacion: '',
  });

  const { notify } = useNotification();

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setParams((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateParams = (): boolean => {
    const { fechaInicio, fechaFin } = params;
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    if (endDate < startDate) {
      notify('La fecha final debe ser mayor o igual a la fecha de inicio', 'error');
      return false;
    }

    if (!params.tipoInformacion) {
      notify('Debe seleccionar un tipo de información (Saldos o Movimientos)', 'error');
      return false;
    }

    return true;
  };

  const handleExecute = async () => {
    if (!validateParams()) return;

    try {
      await service.executeTraductor(params);
      notify('Proceso ejecutado con éxito', 'success');
    } catch (error) {
      notify('Error ejecutando el proceso', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <BodyHeader
        headerRoute="Procesos / Traductor"
        TitlePage="Traductor"
        tooltipProps={{ title: "Información sobre la ejecución del proceso de Traductor" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Sistema</InputLabel>
        <Select
          name="sistema"
          value={params.sistema}
          onChange={handleSelectChange}
        >
          {sistemasMock.map((sistema) => (
            <MenuItem key={sistema.clave} value={sistema.clave}>
              {sistema.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Módulo</InputLabel>
        <Select
          name="modulo"
          value={params.modulo}
          onChange={handleSelectChange}
        >
          {modulosMock.map((modulo) => (
            <MenuItem key={modulo.clave} value={modulo.clave}>
              {modulo.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Tipo de Información</InputLabel>
        <Select
          name="tipoInformacion"
          value={params.tipoInformacion}
          onChange={handleSelectChange}
        >
          <MenuItem value="S">Saldos</MenuItem>
          <MenuItem value="M">Movimientos</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Fecha Inicio"
        type="date"
        name="fechaInicio"
        value={params.fechaInicio}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Fecha Fin"
        type="date"
        name="fechaFin"
        value={params.fechaFin}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleExecute}>
          Ejecutar
        </Button>
      </Box>
    </Box>
  );
};

export default TraductorPage;
