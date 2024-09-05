import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { Modulo, Sistema } from '../../../types';
import * as serviceSistema from '../selectores/serviceSelectorSistemas';




interface AddModuloModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (modulo: Modulo) => void;
  initialData?: Modulo | null;
}

const AddModuloModal: React.FC<AddModuloModalProps> = ({ open, onClose, onSave, initialData }) => {
const [claveSistema, setClaveSistema] = useState<string>('');
const [sistemas, setSistemas] = useState<Sistema[]>([]); 
const minValue = 0  
const maxValue = 99;
const [numRegistros, setNumRegistros] = useState<number>(minValue);


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

  const fetchData = async () => {
    try {
    const dataSist= await serviceSistema.fetchSistemas();
    setSistemas(dataSist);
   
    } catch (error) {
      console.error('Error al cargar los datos de columnas:', error);
      notify('Error al cargar los datos de columnas', 'error');
    }
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchData();
    if (initialData) {
      setClaveSistema(initialData.clave_sistema);
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

  const handle = (e) => {
    const newValue = Math.min(Math.max(e.target.value, minValue), maxValue)


    setNewModulo({ ...newModulo, ['num_registros']: newValue });
}

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newModulo.clave_sistema) newErrors.clave_sistema = 'Clave del sistema es requerida';
    if (!newModulo.clave_modulo) newErrors.clave_modulo = 'Clave del módulo es requerida';

    setErrors(newErrors);

    newModulo.fecha_carga==newModulo.fecha_informacion;
    console.log(newModulo.num_registros)
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
            select
            label="Clave del Sistema - Nombre del Sistema"
            value={newModulo.clave_sistema}
            onChange={(e) => handleInputChange('clave_sistema', e.target.value)}
            fullWidth
            required
            error={!!errors.clave_sistema}
            helperText={errors.clave_sistema}
          > {
              sistemas?.map(sistema => <MenuItem value={sistema.sis_clave}>{sistema.sis_clave}</MenuItem>)
            }
          </TextField>
        </Box>
        
        <Box mb={2}>
          <TextField
            label="Clave del Módulo"
            value={newModulo.clave_modulo}
            onChange={(e) => handleInputChange('clave_modulo', e.target.value)}
            fullWidth
            required
            inputProps={{ maxLength: 10 }}
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
            inputProps={{ maxLength: 50 }}
            error={!!errors.nombre_modulo}
            helperText={errors.nombre_modulo}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Fecha Carga"
            type="date"
            value={newModulo.fecha_carga || ''}
            onChange={(e) => handleInputChange('fecha_carga', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}

          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Número Registros"
            type="number"
            value={newModulo.num_registros}
            onChange={(e) => handle(e)}
            inputProps={{ maxLength: 2 , type: 'number', min: "0", max: "99", step: "1"}}
            fullWidth
            disabled={!!initialData}
            error={!!errors.num_registros}
            helperText={errors.num_registros}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Fecha Información"
            type="date"
            value={newModulo.fecha_informacion || ''}
            onChange={(e) => handleInputChange('fecha_informacion', e.target.value)}
            fullWidth
            disabled={!!initialData}
            InputLabelProps={{ shrink: true }}

          />
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Tipo de Transacción"
            value={newModulo.tipo_transaccion || ''}
            onChange={(e) => handleInputChange('tipo_transaccion', e.target.value as 'A' | 'S' | null)}
            fullWidth
          >
            <MenuItem value="A">Archivo</MenuItem>
            <MenuItem value="S">Sistema</MenuItem>
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Estatus de Transaccion"
            value={newModulo.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value as 'S' | 'N' | null)}
            fullWidth
            disabled={!!initialData}
          >
            <MenuItem value="S">Correcta</MenuItem>
            <MenuItem value="N">Incorrecta</MenuItem>
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
          select
            label="Agrupación de Reportes"
            value={newModulo.agrupacion_reportes || ''}
            onChange={(e) => handleInputChange('agrupacion_reportes', e.target.value)}
            fullWidth
            >
               <MenuItem value="S">Sí</MenuItem>
               <MenuItem value="N">No</MenuItem>
            </TextField>
          
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
function setSistemas(dataSist: any) {
  throw new Error('Function not implemented.');
}

function notify(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

