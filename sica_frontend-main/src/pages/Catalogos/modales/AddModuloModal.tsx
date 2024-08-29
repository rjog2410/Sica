import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { Modulo } from '../../../types';

interface AddModuloModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (modulo: Modulo) => void;
  initialData?: Modulo | null;
}

const AddModuloModal: React.FC<AddModuloModalProps> = ({ open, onClose, onSave, initialData }) => {
  const [newModulo, setNewModulo] = useState<Modulo>({
    clave_sistema: '',
    clave_modulo: '',
    nombre_modulo: '',
    fecha_carga: null,
    num_registros: null,
    fecha_informacion: null,
    tipo_transaccion: null, // Se inicia como null
    status: null,           // Se inicia como null
    agrupacion_reportes: null
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setNewModulo(initialData);
    } else {
      setNewModulo({
        clave_sistema: '',
        clave_modulo: '',
        nombre_modulo: '',
        fecha_carga: null,
        num_registros: null,
        fecha_informacion: null,
        tipo_transaccion: null,
        status: null,
        agrupacion_reportes: null
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof Modulo, value: any) => {
    setNewModulo({ ...newModulo, [field]: value });
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newModulo.clave_sistema) newErrors.clave_sistema = 'Clave del sistema es requerida';
    if (!newModulo.clave_modulo) newErrors.clave_modulo = 'Clave del módulo es requerida';
    if (!newModulo.nombre_modulo) newErrors.nombre_modulo = 'Nombre del módulo es requerido';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(newModulo);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Módulo' : 'Agregar Módulo'}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            label="Clave del Sistema"
            value={newModulo.clave_sistema}
            onChange={(e) => handleInputChange('clave_sistema', e.target.value)}
            fullWidth
            required
            error={!!errors.clave_sistema}
            helperText={errors.clave_sistema}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Clave del Módulo"
            value={newModulo.clave_modulo}
            onChange={(e) => handleInputChange('clave_modulo', e.target.value)}
            fullWidth
            required
            error={!!errors.clave_modulo}
            helperText={errors.clave_modulo}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Nombre del Módulo"
            value={newModulo.nombre_modulo}
            onChange={(e) => handleInputChange('nombre_modulo', e.target.value)}
            fullWidth
            required
            error={!!errors.nombre_modulo}
            helperText={errors.nombre_modulo}
          />
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Tipo de Transacción"
            value={newModulo.tipo_transaccion || ''}
            onChange={(e) => handleInputChange('tipo_transaccion', e.target.value as 'A' | 'S' | null)}
            fullWidth
            required
          >
            <MenuItem value="A">Archivo</MenuItem>
            <MenuItem value="S">Sistema</MenuItem>
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Estatus"
            value={newModulo.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value as 'S' | 'N' | null)}
            fullWidth
            required
          >
            <MenuItem value="S">Correcta</MenuItem>
            <MenuItem value="N">Incorrecta</MenuItem>
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            label="Agrupación de Reportes"
            value={newModulo.agrupacion_reportes || ''}
            onChange={(e) => handleInputChange('agrupacion_reportes', e.target.value)}
            fullWidth
          />
        </Box>
        {/* Agrega más campos según sea necesario */}
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

export default AddModuloModal;
