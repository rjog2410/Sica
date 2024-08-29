import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { Sistema } from '../types';

interface ModalFormProps {
  open: boolean;
  handleClose: () => void;
  handleSave: (sistema: Partial<Sistema>) => void;
  initialData?: Sistema | null;
}

const ModalForm: React.FC<ModalFormProps> = ({ open, handleClose, handleSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Sistema>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ sis_clave: '', sis_nombre: '', sis_prefijo: '', sis_fecha_inicio: '', sis_registros: 0 });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    handleSave(formData);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ padding: 2, backgroundColor: 'white', margin: 'auto', top: '50%', transform: 'translateY(-50%)' }}>
        <Typography variant="h6">{initialData ? 'Editar Sistema' : 'Nuevo Sistema'}</Typography>
        <TextField
          label="Clave del Sistema"
          name="sis_clave"
          value={formData.sis_clave || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nombre del Sistema"
          name="sis_nombre"
          value={formData.sis_nombre || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Prefijo del Sistema"
          name="sis_prefijo"
          value={formData.sis_prefijo || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Inicio"
          name="sis_fecha_inicio"
          value={formData.sis_fecha_inicio || ''}
          onChange={handleChange}
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Registros"
          name="sis_registros"
          value={formData.sis_registros || ''}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalForm;
