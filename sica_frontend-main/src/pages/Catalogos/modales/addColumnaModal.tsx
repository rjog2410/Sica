import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { Columna } from '../../../types';

interface AddColumnaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (columna: Columna) => void;
  initialData?: Columna | null;
}

const AddColumnaModal: React.FC<AddColumnaModalProps> = ({ open, onClose, onSave, initialData }) => {
  const [claveSistema, setClaveSistema] = useState<string>('');
  const [claveModulo, setClaveModulo] = useState<string>('');
  const [numeroColumna, setNumeroColumna] = useState<number | ''>('');
  const [titulo, setTitulo] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setClaveSistema(initialData.clave_sistema);
      setClaveModulo(initialData.clave_modulo);
      setNumeroColumna(initialData.numero_columna);
      setTitulo(initialData.titulo);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setClaveSistema('');
    setClaveModulo('');
    setNumeroColumna('');
    setTitulo('');
  };

  const handleSave = () => {
    if (claveSistema && claveModulo && numeroColumna !== '' && titulo) {
      onSave({
        clave_sistema: claveSistema,
        clave_modulo: claveModulo,
        numero_columna: numeroColumna as number,
        titulo,
      });
      onClose();
      resetForm();
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Columna' : 'Agregar Columna'}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            select
            label="Clave del Sistema"
            value={claveSistema}
            onChange={(e) => setClaveSistema(e.target.value)}
            fullWidth
            required
          >
            {/* Opciones simuladas, en tu aplicación real deberías cargarlas desde el estado o props */}
            <MenuItem value="SISTEMA1">SISTEMA1</MenuItem>
            <MenuItem value="SISTEMA2">SISTEMA2</MenuItem>
            {/* Agrega más sistemas aquí */}
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Clave del Módulo"
            value={claveModulo}
            onChange={(e) => setClaveModulo(e.target.value)}
            fullWidth
            required
          >
            {/* Opciones simuladas, en tu aplicación real deberías cargarlas desde el estado o props */}
            <MenuItem value="MODULO1">MODULO1</MenuItem>
            <MenuItem value="MODULO2">MODULO2</MenuItem>
            {/* Agrega más módulos aquí */}
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            label="Número de Columna"
            type="number"
            value={numeroColumna}
            onChange={(e) => setNumeroColumna(e.target.value === '' ? '' : parseInt(e.target.value))}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddColumnaModal;
