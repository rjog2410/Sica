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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

  const validate = () => {
    let tempErrors: { [key: string]: string } = {};
    console.log("clave sistema: ",!!cuentaData.clave_sistema)
    if (!cuentaData.clave_sistema) {
      tempErrors.clave_sistema = "La clave del sistema es obligatoria";
    }
    if (!cuentaData.clave_modulo) {
      tempErrors.clave_modulo = "La clave del modulo es obligatoria";
    }
    if (!cuentaData.cuenta ) {
      tempErrors.cuenta = "La cuenta es obligatoria";
    }
    if (cuentaData.cuenta.length > 25){
      tempErrors.cuenta = "Longitud de campo invalida max 25 caracteres [0-9]";
    }
    if (!/([0-9])\w+/g.test(cuentaData.cuenta)){
      tempErrors.cuenta = "Solo numeros";
    }
    // @ts-ignore
    if (cuentaData.tipo_ente?.toString().length > 2){
      tempErrors.cuenta = "Longitud invalida para tipo ente";
    }
    // @ts-ignore
    if (!/([0-9])\w+/g.test(cuentaData.tipo_ente?.toString())){
      tempErrors.cuenta = "Solo numeros";
    }
    // @ts-ignore
    if (cuentaData.ente?.toString().length > 6){
      tempErrors.cuenta = "Longitud invalida para tipo ente";
    }
    // @ts-ignore
    if (!/([0-9])\w+/g.test(cuentaData.ente?.toString())){
      tempErrors.cuenta = "Solo numeros";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      setCuentaData({
        ...cuentaData,
        [name]: value,
      });
    };

  const handleSave = () => {
    if (validate()) {
      onSave(cuentaData);
      onClose();
    }
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
              error={!!errors.clave_sistema}
              helperText={errors.clave_sistema}
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
              error={!!errors.clave_modulo}
              helperText={errors.clave_modulo}
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
              error={!!errors.cuenta}
              helperText={errors.cuenta}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tipo ente"
              name="tipo_ente"
              value={cuentaData.tipo_ente}
              onChange={handleChange}
              error={!!errors.tipo_ente}
              helperText={errors.tipo_ente}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ente"
              name="ente"
              value={cuentaData.ente}
              onChange={handleChange}
              error={!!errors.ente}
              helperText={errors.ente}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tipo conciliacion"
              name="tipo_conciliacion"
              value={cuentaData.tipo_conciliacion}
              onChange={handleChange}
              type="number"
              error={!!errors.tipo_conciliacion}
              helperText={errors.tipo_conciliacion}
            />
          </Grid>
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
