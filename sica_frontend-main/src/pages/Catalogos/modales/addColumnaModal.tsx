import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { Columna, Sistema, Modulo } from '../../../types';
import * as serviceSistema from '../selectores/serviceSelectorSistemas';
import * as serviceModulo from '../selectores/serviceSelectorModulos';
import { useNotification } from '../../../providers/NotificationProvider';

interface AddColumnaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (columna: Columna) => void;
  initialData?: Columna | null;
}

const AddColumnaModal: React.FC<AddColumnaModalProps> = ({ open, onClose, onSave, initialData }) => {
  const [sistemas, setSistemas] = useState<Sistema[]>([]); 
  const [modulos, setModulos] = useState<String[]>([]);
  const minValue = 0  
  const maxValue = 99;
  const [claveSistema, setClaveSistema] = useState<string>('');
  const [claveModulo, setClaveModulo] = useState<string>('');
  const [numeroColumna, setNumeroColumna] = useState<number>(minValue);
  const [titulo, setTitulo] = useState<string>('');
  const { notify } = useNotification();  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});



  const fetchData = async () => {
    try {
    const dataSist= await serviceSistema.fetchSistemas();
    setSistemas(dataSist);
   
    } catch (error) {
      console.error('Error al cargar los datos de columnas:', error);
      notify('Error al cargar los datos de columnas', 'error');
    }
  };

  const fetchDataMOduloByClaveSistema = async () => {
    try {
    const dataModXSist= await serviceModulo.fetchModuloByClave(claveSistema);
    console.log(dataModXSist);
    setModulos(dataModXSist);
   
    } catch (error) {
      console.error('Error al cargar los datos de modulos para clave sistema: '+claveSistema, error);
      notify('Error al cargar los datos de modulos para clave sistema: '+claveSistema, 'error');
    }
  };

  useEffect(() => {
    fetchData();
    if (initialData) {
      setClaveSistema(initialData.clave_sistema);
      setClaveModulo(initialData.clave_modulo);
      setNumeroColumna(initialData.numero_columna);
      setTitulo(initialData.titulo);      
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setClaveSistema('');
    setClaveModulo('');
    setNumeroColumna(0);
    setTitulo('');
  };


  useEffect(() => {
    if (claveSistema && claveSistema !== 'ALL') {
      fetchDataMOduloByClaveSistema();     
    } else {      
      setModulos([]);
    }
  }, [claveSistema]);


  const handleSave = () => {
    if (validate()) {
      onSave({
        clave_sistema: claveSistema,
        clave_modulo: claveModulo,
        numero_columna: numeroColumna as number,
        titulo: titulo,
      });
      onClose();
      resetForm();
    } else {
      notify('Por favor, complete todos los campos obligatorios.','info');
    }
  };

  const handle = (e) => {
    const newValue = Math.min(Math.max(e.target.value, minValue), maxValue)
    setNumeroColumna(previousValue => newValue)
}



  const validate = () => {
    let tempErrors: { [key: string]: string } = {};

    if (!claveSistema) {
      tempErrors.claveSistema = "La clave del sistema es obligatoria";
    } 
     if (!claveModulo ) {
      tempErrors.claveModulo = "La clave del módulo es obligatoria";
    }
    if (numeroColumna < 0 || numeroColumna>99) {
      tempErrors.noColumna = "El número de columna debe estar en el rango de 0 a 99";
    }
    if (!titulo) {
      tempErrors.titulo = "El título es obligatorio";
    }
    if (titulo.length >= 50) {
      tempErrors.sis_nombre = "El título no puede exceder los 50 caracteres";
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Columna' : 'Agregar Columna'}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            select
            label="Clave del Sistema"
            value={claveSistema}
            onChange={(e) => setClaveSistema(e.target.value)}
            fullWidth  
            required 
            error={!!errors?.claveSistema}
            helperText={errors?.claveSistema}          
            
          >

            {
              sistemas?.map(sistema => <MenuItem value={sistema.sis_clave}>{sistema.sis_clave}</MenuItem>)
            }

          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Clave del Módulo"
            value={claveModulo}
            onChange={(e) => setClaveModulo(e.target.value)}
            fullWidth
            required
            error={!!errors?.claveModulo}
            helperText={errors?.claveModulo}
          >
            {
              modulos?.map(modulo => <MenuItem value={modulo.mod_clave}>{modulo.mod_clave}</MenuItem>)
            }
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            label="Número de Columna"
            type="number"
            value={numeroColumna}
            onChange={(e) => handle(e)}
            fullWidth
            inputProps={{ maxLength: 2 , type: 'number', min: "0", max: "99", step: "1"}}
            required
            error={!!errors?.noColumna}
            helperText={errors?.noColumna}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            required
            error={!!errors?.titulo}
            helperText={errors?.titulo}
            inputProps={{ maxLength: 50 }}
          />
        </Box>
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

export default AddColumnaModal;
