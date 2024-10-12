import React, { useState, useEffect } from 'react';
import {Checkbox, ListItemText, ListItemIcon, ListItemButton,ListItem, List, FormControl, FormLabel, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText} from '@mui/material';
import { Rol , Pantalla} from '../../../types';


import { useNotification } from '../../../providers/NotificationProvider';

interface RolModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (rol: Rol) => void;
  initialData?: Rol | null;
  pantallas: Pantalla[] | [];
}

const ModalRol: React.FC<RolModalProps> = ({ open, onClose, onSave, initialData, pantallas }) => {
  const [id, setId] = useState<number>(0);
  const [nombreRol, setNombreRol] = useState<string>('');
  const [pantallasId, setPantallasId] =useState([])
  const { notify } = useNotification();  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 

  


  const fetchData = async () => {
    try {
        // falta consultar el detalle de cada rol no hay servicio
    //const dataRol= await serviceRol.fetchRol(initialData.id);
    //setSistemas(dataSist);
   
    } catch (error) {
      console.error('Error al cargar los datos de columnas:', error);
      notify('Error al cargar los datos de columnas', 'error');
    }
  };

  

  useEffect(() => {
    fetchData();
    if (initialData) {
      setId(initialData.id);
      setNombreRol(initialData.nombre_rol);
      //setPantallasId(initialData.pantallasId);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setId(0);
    setNombreRol('');
    setPantallasId([]);
  };


  


  const handleSave = () => {
    if (validate()) {
      onSave({
        id: id,
        nombre_rol: nombreRol,
        pantallasId: pantallasId,
      });
      onClose();
      resetForm();
    } else {
      notify('Por favor, complete todos los campos obligatorios.','info');
    }
  };

//  const handle = (e) => {
//    const newValue = Math.min(Math.max(e.target.value, minValue), maxValue)
//    setNumeroColumna(previousValue => newValue)
//}



  const validate = () => {
    let tempErrors: { [key: string]: string } = {};

    if (!nombreRol) {
      tempErrors.nombre_rol = "El nombre del rol es obligatorio";
    } 
     
    if (!pantallasId || pantallasId.length==0) {
      tempErrors.pantallasId = "Debe seleccionar al menos una pantalla para el rol";
    }
    if (nombreRol.length >= 100) {
      tempErrors.nombre_rol = "El nombre del rol no puede exceder los 100 caracteres";
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  
  const handleToggle = (value: number) => () => {
    const currentIndex = pantallasId.indexOf(value);
    const newChecked = [...pantallasId];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setPantallasId(newChecked);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Rol' : 'Agregar Rol'}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            label="Nombre del rol"
            type="text"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
            fullWidth
            required
            error={!!errors?.nombre_rol}
            helperText={errors?.nombre_rol}
            inputProps={{ maxLength: 100 }}
          />
        </Box>
        <Box mb={2}>
        <FormControl
        required
        error={!!errors?.pantallasId }
        component="fieldset"
        sx={{ m: 3 }}
        variant="standard"
      >
        <FormLabel component="legend">Asignación de Pantallas</FormLabel>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} >
            {pantallas.map((pant) => {
              const labelId = `checkbox-list-label-${pant.id_pantalla}`;

              return (
                <ListItem
                  key={pant.id_pantalla}
                  disablePadding
                >
                  <ListItemButton role={undefined} onClick={handleToggle(pant.id_pantalla)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={pantallasId.includes(pant.id_pantalla)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={pant.nombre_menu+' - '+pant.nombre_pantalla} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <FormHelperText>{!!errors?.pantallasId ? errors?.pantallasId : '' }</FormHelperText>
          </FormControl>
      
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

export default ModalRol;
