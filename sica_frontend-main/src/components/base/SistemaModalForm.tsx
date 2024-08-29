import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import { Sistema } from '../../types';

interface SistemaFormProps {
  selectedSistema: Sistema | null;
  onSave: (sistema: Sistema) => void;
  onCancel: () => void;
}

const SistemaForm: React.FC<SistemaFormProps> = ({ selectedSistema, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState<Sistema>({
    sis_clave: '',
    sis_nombre: '',
  });

  // Actualizar los valores del formulario cuando se selecciona un sistema
  useEffect(() => {
    if (selectedSistema) {
      setFormValues({
        sis_clave: selectedSistema.sis_clave,
        sis_nombre: selectedSistema.sis_nombre,
      });
    } else {
      setFormValues({
        sis_clave: '',
        sis_nombre: '',
      });
    }
  }, [selectedSistema]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formValues); // Llamada a la API a través del prop `onSave`
  };

  return (
    <Paper sx={styles.paper}>
      <form onSubmit={handleSubmit}>
        <Box sx={styles.formContainer}>
          <TextField
            label="Clave del Sistema"
            variant="outlined"
            name="sis_clave"
            value={formValues.sis_clave}
            onChange={handleChange}
            required
            disabled={!!selectedSistema} // Deshabilitar si está editando
            sx={styles.textField}
          />
          <TextField
            label="Nombre del Sistema"
            variant="outlined"
            name="sis_nombre"
            value={formValues.sis_nombre}
            onChange={handleChange}
            required
            sx={styles.textField}
          />
          <Box sx={styles.buttonContainer}>
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
            <Button variant="contained" color="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

// Estilos separados
const styles = {
  paper: {
    padding: 3,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  textField: {
    marginBottom: 2,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
  },
};

export default SistemaForm;
