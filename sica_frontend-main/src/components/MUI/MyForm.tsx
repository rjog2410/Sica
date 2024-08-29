import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';

interface FormData {
  firstName: string;
  lastName: string;
}

interface MyFormProps {
  onSubmit: SubmitHandler<FormData>;
}

const MyForm: React.FC<MyFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm<FormData>();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <Box mb={2}>
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="First Name" variant="outlined" fullWidth />
          )}
        />
      </Box>
      <Box mb={2}>
        <Controller
          name="lastName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Last Name" variant="outlined" fullWidth />
          )}
        />
      </Box>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default MyForm;
