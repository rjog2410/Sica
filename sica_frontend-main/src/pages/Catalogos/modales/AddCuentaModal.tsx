import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import { Cuenta } from '@/types';

interface AddCuentaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (cuenta: Cuenta) => void;
  initialData?: Cuenta | null;
}

const AddCuentaModal: React.FC<AddCuentaModalProps> = ({ open, onClose, onSave, initialData }) => {
  const [cuentaData, setCuentaData] = useState<Cuenta>({
    clave_sistema: '',
    clave_modulo: '',
    cuenta: '',
    clave_regla: '',
    descripcion: '',
    reg_cuc_clave: 0,
    reg_tit_mod_sis_clave: '',
    reg_tit_mod_clave: '',
    reg_tit_columna: 0,
    subcta1: null,
    subcta2: null,
    subcta3: null,
    subcta4: null,
    subcta5: null,
    subcta6: null,
    subcta7: null,
    tipo_ente: null,
    ente: null,
    tipo_conciliacion: 'E',
    consolida_ente: 'NO',
    inc_saldo: 'SI',
    inc_movs: 'SI',
  });

  useEffect(() => {
    if (initialData) {
      setCuentaData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCuentaData({
      ...cuentaData,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(cuentaData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Cuenta' : 'Agregar Cuenta'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clave Sistema"
              name="clave_sistema"
              value={cuentaData.clave_sistema}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clave Módulo"
              name="clave_modulo"
              value={cuentaData.clave_modulo}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cuenta"
              name="cuenta"
              value={cuentaData.cuenta}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clave Regla"
              name="clave_regla"
              value={cuentaData.clave_regla}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={cuentaData.descripcion}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clave Cuc"
              name="reg_cuc_clave"
              value={cuentaData.reg_cuc_clave}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          {/* Se pueden agregar más campos según sea necesario */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCuentaModal;
