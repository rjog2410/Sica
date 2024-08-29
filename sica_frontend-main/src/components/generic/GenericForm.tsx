import React, { useState } from 'react';
import { Button, TextField, Box, Grid } from '@mui/material';

interface GenericFormProps {
  initialValues: any;
  fields: string[];
  onSave: (values: any) => void;
  onCancel: () => void;
  styles?: any; // Estilos opcionales
}

const GenericForm: React.FC<GenericFormProps> = ({ initialValues, fields, onSave, onCancel, styles = {} }) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ ...styles }}>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} key={field}>
            <TextField
              fullWidth
              label={field}
              name={field}
              value={values[field] || ''}
              onChange={handleChange}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Guardar</Button>
          <Button variant="outlined" color="secondary" onClick={onCancel} sx={{ ml: 2 }}>Cancelar</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenericForm;
