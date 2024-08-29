import React, { useState } from 'react';
import { Box, Button, Select, MenuItem, TextField, FormControl, InputLabel, Checkbox, FormControlLabel, SelectChangeEvent } from '@mui/material';
import { ExtraccionParams } from '../../types';
import { sistemasMock, modulosMock } from './serviceSelectorExtraccionSIF';
import * as service from './serviceSelectorExtraccionSIF';
import { useNotification } from '../../providers/NotificationProvider';
import BodyHeader from '../../components/base/BodyHeader';

const ExtraccionSIFPage: React.FC = () => {
  const [params, setParams] = useState<ExtraccionParams>({
    sistema: 'TODOS',
    modulo: 'TODOS',
    tipoInformacion: '',
    fechaInicio: '',
    fechaFin: '',
    borrarInformacion: false,
  });

  const { notify } = useNotification();

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setParams((prev) => ({
      ...prev,
      [name!]: value === 'TODOS' ? '%' : value, // Asignamos "%" si selecciona "TODOS"
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateParams = (): boolean => {
    const { fechaInicio, fechaFin } = params;
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    if (startDate.getDate() !== 1) {
      notify('La fecha de inicio debe ser el primer día del mes', 'error');
      return false;
    }

    if (endDate < startDate) {
      notify('La fecha final debe ser mayor o igual a la fecha de inicio', 'error');
      return false;
    }

    return true;
  };

  const handleExecute = async () => {
    if (!validateParams()) return;

    try {
      await service.executeExtraccionSIF(params);
      notify('Proceso ejecutado con éxito', 'success');
    } catch (error) {
      notify('Error ejecutando el proceso', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <BodyHeader
        headerRoute="Procesos / Extracción SIF"
        TitlePage="Extracción SIF"
        tooltipProps={{ title: "Información sobre la ejecución del proceso de Extracción SIF" }}
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
          <MenuItem value="TODOS">TODOS</MenuItem>
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
          <MenuItem value="TODOS">TODOS</MenuItem>
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

      <FormControlLabel
        control={
          <Checkbox
            name="borrarInformacion"
            checked={params.borrarInformacion}
            onChange={handleCheckboxChange}
          />
        }
        label="Borrar Información"
      />

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleExecute}>
          Ejecutar
        </Button>
      </Box>
    </Box>
  );
};

export default ExtraccionSIFPage;
