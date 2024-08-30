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
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string | null>('ALL');
  const [selectedModulo, setSelectedModulo] = useState<string | null>('ALL');
  const [claveSistema, setClaveSistema] = useState<string>('');
  const [claveModulo, setClaveModulo] = useState<string>('');
  const [numeroColumna, setNumeroColumna] = useState<number | ''>('');
  const [titulo, setTitulo] = useState<string>('');
  const { notify } = useNotification();
  const [newColumna, setNewColumna] = useState<Columna>({ clave_sistema: '', clave_modulo: '', numero_columna: 0,titulo:'' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchData = async () => {
    try {
    const dataSist= await serviceSistema.fetchSistemas();
    setSistemas(dataSist);
    const dataMod= await serviceModulo.fetchModulos();
    setModulos(dataMod);
   
    } catch (error) {
      console.error('Error al cargar los datos de columnas:', error);
      notify('Error al cargar los datos de columnas', 'error');
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
    setNumeroColumna('');
    setTitulo('');
  };


  useEffect(() => {
    // reemplazar el filter por llamada al back para retornar los modulos con base al sistema seleciconado
    if (claveSistema && claveSistema !== 'ALL') {
      const modulosFiltrados = modulos
        .filter(modulo => modulo.clave_sistema === claveSistema)
        .map(modulo => modulo);
      setModulos([ ...Array.from(new Set(modulosFiltrados))]);
    } else {
      setModulos([]);
    }
  }, [claveSistema]);


  const handleSave = () => {
    if (claveSistema && claveModulo && numeroColumna !== '' && titulo) {
      onSave({
        clave_sistema: claveSistema,
        clave_modulo: claveModulo,
        numero_columna: numeroColumna as number,
        titulo,
      });
      onClose();
      resetForm();
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
    }
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Columna' : 'Agregar Columna'}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            select
            label="Clave del Sistema - Nombre del Sistema"
            value={claveSistema}
            onChange={(e) => setClaveSistema(e.target.value)}
            fullWidth
            required
          >

            {
              sistemas?.map(sistema => <MenuItem value={sistema.sis_clave}>{sistema.sis_clave}-{sistema.sis_nombre}</MenuItem>)
            }

          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Clave del Módulo - Nombre del Módulo"
            value={claveModulo}
            onChange={(e) => setClaveModulo(e.target.value)}
            fullWidth
            required
          >
            {
              modulos?.map(modulo => <MenuItem value={modulo.clave_modulo}>{modulo.clave_modulo}-{modulo.nombre_modulo}</MenuItem>)
            }
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            label="Número de Columna"
            type="number"
            value={numeroColumna}
            onChange={(e) => setNumeroColumna(e.target.value === '' ? '' : parseInt(e.target.value))}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            required
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
