// src/components/base/FiltrosDetalle.tsx
import React from 'react';
import { Box, Button } from '@mui/material';

interface FiltrosDetalleProps {
  sistema: string;
  modulo: string;
  setSistema: (sistema: string) => void;
  setModulo: (modulo: string) => void;
  onConsultar: () => void;
}

const FiltrosDetalle: React.FC<FiltrosDetalleProps> = ({ sistema, modulo, setSistema, setModulo, onConsultar }) => {
  return (
    <Box display="flex" justifyContent="space-between" mb={2}>
      <select value={sistema} onChange={(e) => setSistema(e.target.value)}>
        <option value="">Seleccionar Sistema</option>
        <option value="SISTEMA1">Sistema 1</option>
        <option value="SISTEMA2">Sistema 2</option>
      </select>
      <select value={modulo} onChange={(e) => setModulo(e.target.value)}>
        <option value="">Seleccionar Módulo</option>
        <option value="MODULO1">Módulo 1</option>
        <option value="MODULO2">Módulo 2</option>
      </select>
      <Button variant="contained" color="primary" onClick={onConsultar}>
        Consultar
      </Button>
    </Box>
  );
};

export default FiltrosDetalle;
