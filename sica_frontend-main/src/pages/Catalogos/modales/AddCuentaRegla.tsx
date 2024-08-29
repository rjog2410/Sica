import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { Regla } from '../../../types';

interface AddCuentaReglaProps {
  open: boolean;
  onClose: () => void;
  onSave: (newRegla: Regla) => void;
  initialData?: Regla | null;
}

const AddCuentaRegla: React.FC<AddCuentaReglaProps> = ({ open, onClose, onSave, initialData }) => {
  const [newRegla, setNewRegla] = useState<Regla>({
    id: 0,
    clave_regla: '',
    descripcion: '',
    reg_cuc_clave: 0,
    reg_tit_mod_sis_clave: '',
    reg_tit_mod_clave: '',
    reg_tit_columna: 0,
    reg_secuencia: 0,
    reg_operador: '',
    reg_valor: '',  // Asume que es un string, ajústalo si es necesario
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setNewRegla(initialData);
    } else {
      setNewRegla({
        id: 0,
        clave_regla: '',
        descripcion: '',
        reg_cuc_clave: 0,
        reg_tit_mod_sis_clave: '',
        reg_tit_mod_clave: '',
        reg_tit_columna: 0,
        reg_secuencia: 0,
        reg_operador: '',
        reg_valor: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRegla((prev) => ({
      ...prev,
      [name]: name === 'reg_cuc_clave' || name === 'reg_tit_columna' || name === 'reg_secuencia' ? Number(value) : value,
    }));
  };

  const validate = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!newRegla.clave_regla) {
      tempErrors.clave_regla = "La clave de la regla es obligatoria";
    } else if (newRegla.clave_regla.length > 100) {
      tempErrors.clave_regla = "La clave de la regla no puede exceder los 100 caracteres";
    }

    if (newRegla.descripcion.length > 100) {
      tempErrors.descripcion = "La descripción no puede exceder los 100 caracteres";
    }

    // Agregar más validaciones si es necesario...

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(newRegla);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Regla' : 'Agregar Nueva Regla'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Clave de la Regla"
          name="clave_regla"
          fullWidth
          value={newRegla.clave_regla}
          onChange={handleChange}
          error={!!errors.clave_regla}
          helperText={errors.clave_regla}
          disabled={!!initialData}
        />
        <TextField
          margin="dense"
          label="Descripción"
          name="descripcion"
          fullWidth
          value={newRegla.descripcion}
          onChange={handleChange}
          error={!!errors.descripcion}
          helperText={errors.descripcion}
        />
        <TextField
          margin="dense"
          label="Clave CUC"
          name="reg_cuc_clave"
          fullWidth
          value={newRegla.reg_cuc_clave}
          onChange={handleChange}
          error={!!errors.reg_cuc_clave}
          helperText={errors.reg_cuc_clave}
          type="number"
        />
        <TextField
          margin="dense"
          label="Clave del Módulo Sistema"
          name="reg_tit_mod_sis_clave"
          fullWidth
          value={newRegla.reg_tit_mod_sis_clave}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Clave del Módulo"
          name="reg_tit_mod_clave"
          fullWidth
          value={newRegla.reg_tit_mod_clave}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Número de Columna"
          name="reg_tit_columna"
          fullWidth
          value={newRegla.reg_tit_columna}
          onChange={handleChange}
          type="number"
        />
        <TextField
          margin="dense"
          label="Secuencia"
          name="reg_secuencia"
          fullWidth
          value={newRegla.reg_secuencia}
          onChange={handleChange}
          type="number"
        />
        <TextField
          margin="dense"
          label="Operador"
          name="reg_operador"
          fullWidth
          value={newRegla.reg_operador}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Valor"
          name="reg_valor"
          fullWidth
          value={newRegla.reg_valor}
          onChange={handleChange}
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

export default AddCuentaRegla;
