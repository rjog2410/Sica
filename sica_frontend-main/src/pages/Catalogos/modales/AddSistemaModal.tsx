import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { Sistema } from '../../../types';

interface AddSistemaModalProps {
  open: boolean;
  onClose: () => void; // Aquí estaba el error, faltaba un punto y coma
  onSave: (newSistema: Sistema) => void;
  initialData?: Sistema | null;
}

const AddSistemaModal: React.FC<AddSistemaModalProps> = ({ open, onClose, onSave, initialData }) => {
  const [newSistema, setNewSistema] = useState<Sistema>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setNewSistema(initialData);
    } else {
      setNewSistema({ sis_clave: '', sis_nombre: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSistema((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!newSistema.sis_clave) {
      tempErrors.sis_clave = "La clave del sistema es obligatoria";
    } 
     if (newSistema.sis_clave.length >= 100) {
      tempErrors.sis_clave = "La clave del sistema no puede exceder los 100 caracteres";
    }
    if (newSistema.sis_nombre.length >= 100) {
      tempErrors.sis_nombre = "El nombre del sistema no puede exceder los 100 caracteres";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(newSistema);
      onClose();
    }
    
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Sistema' : 'Agregar Nuevo Sistema'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Clave del Sistema"
          name="sis_clave"
          fullWidth
          value={newSistema.sis_clave}
          onChange={handleChange}
          error={!!errors.sis_clave}
          helperText={errors.sis_clave}
          disabled={!!initialData}
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          margin="dense"
          label="Nombre del Sistema"
          name="sis_nombre"
          fullWidth
          value={newSistema.sis_nombre}
          onChange={handleChange}
          error={!!errors.sis_nombre}
          helperText={errors.sis_nombre}
          inputProps={{ maxLength: 100 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          {initialData ? 'Guardar Cambios' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSistemaModal;
