import React from 'react';
import { Box, Button, Typography, Modal, Paper } from '@mui/material';

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper 
        style={{ 
          padding: 20, 
          maxWidth: 400, 
          margin: 'auto', 
          top: '25%', 
          position: 'absolute', 
          left: '50%', 
          transform: 'translate(-50%, 0)' 
        }}
      >
        <Typography variant="h6" gutterBottom>
          Confirmar eliminación
        </Typography>
        <Typography variant="body1" gutterBottom>
          ¿Está seguro de que desea eliminar este registro?
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} color="secondary" variant="contained">
            Eliminar
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default DeleteConfirmation;
