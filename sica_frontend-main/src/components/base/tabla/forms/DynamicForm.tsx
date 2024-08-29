// src/components/base/tabla/forms/DynamicForm.tsx
import React from 'react';
import { TextField, Button, Grid } from '@mui/material';

interface DynamicFormProps<T> {
  initialValues: T;
  fields: (keyof T)[];
  onSave: (values: T) => void;
  onCancel: () => void;
}

const DynamicForm = <T extends {}>({ initialValues, fields, onSave, onCancel }: DynamicFormProps<T>) => {
  const [values, setValues] = React.useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value } as T);
  };

  return (
    <form>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} key={String(field)}>
            <TextField
              name={String(field)}
              label={String(field)}
              value={(values as any)[field] || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={() => onSave(values)}>
        Guardar
      </Button>
      <Button variant="contained" color="secondary" onClick={onCancel}>
        Cancelar
      </Button>
    </form>
  );
};

export default DynamicForm;
