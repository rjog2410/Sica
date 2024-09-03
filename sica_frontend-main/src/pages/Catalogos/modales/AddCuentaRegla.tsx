import React, {useState, useEffect} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, MenuItem} from '@mui/material';
import {ModuloO, Regla, Sistema} from '../../../types';
import {fetchSistemas} from "@/pages/Catalogos/selectores/serviceSelectorSistemas.ts";
import {fetchModuloByClave} from "@/pages/Catalogos/selectores/serviceSelectorModulos.ts";

interface AddCuentaReglaProps {
    open: boolean;
    onClose: () => void;
    onSave: (newRegla: Regla) => void;
    initialData?: Regla | null;
}

const AddCuentaRegla: React.FC<AddCuentaReglaProps> = ({open, onClose, onSave, initialData}) => {
    const [newRegla, setNewRegla] = useState<Regla>(initialData);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [sistemas, setSistemas] = useState<Sistema[]>([]);
    const [modulos, setModulos] = useState<ModuloO[]>([]);

    useEffect(() => {
        if (initialData) {
            setNewRegla(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        fetchSistemas().then(resp => {
            setSistemas(resp);
        })
    }, []);

    useEffect(() => {
        fetchModuloByClave(newRegla.reg_tit_mod_sis_clave).then(resp => {
            setModulos(resp)
        })
    }, [newRegla?.reg_tit_mod_sis_clave]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewRegla((prev) => ({
            ...prev,
            [name]: name === 'reg_cuc_clave' || name === 'reg_tit_columna' || name === 'reg_secuencia' ? Number(value) : value,
        }));
    };

    const validate = () => {
        let tempErrors: { [key: string]: string } = {};
        if (!newRegla.reg_cuc_clave) {
            tempErrors.clave_regla = "La clave de la regla es obligatoria";
        }
        if (newRegla.reg_cuc_clave.toString().length > 100) {
            tempErrors.clave_regla = "La clave de la regla no puede exceder los 100 caracteres";
        }
        if (!newRegla.reg_secuencia) {
            tempErrors.reg_secuencia = "La secuencia es requerida";
        }
        if (newRegla.reg_secuencia?.toString()?.length > 6) {
            tempErrors.reg_secuencia = "Longitud de campo invalida max 6 caracteres [0-9]";
        }
        if (!/^[0-9]*$/gm.test(newRegla.reg_secuencia?.toString())) {
            tempErrors.reg_secuencia = "Solo numeros";
        }

        if (!newRegla.reg_valor) {
            tempErrors.reg_valor = "El valor es requerioa";
        }
        if (newRegla.reg_valor?.toString()?.length > 5) {
            tempErrors.reg_valor = "Longitud de campo invalida max 2 caracteres [0-9a-zA-Z]";
        }
        if (!/^[0-9a-zA-Z]*$/gm.test(newRegla.reg_valor?.toString())) {
            tempErrors.reg_valor = "El campo debe ser alfanumerico";
        }

        if (!newRegla.reg_tit_columna) {
            tempErrors.reg_tit_columna = "El valor es requerido";
        }
        if (newRegla.reg_tit_columna?.toString()?.length > 2) {
            tempErrors.reg_tit_columna = "Longitud de campo invalida max 2 caracteres [0-9a-zA-Z]";
        }
        if (!/^[0-9]*$/gm.test(newRegla.reg_tit_columna?.toString())) {
            tempErrors.reg_tit_columna = "El campo debe ser numerico";
        }

        if (!newRegla.reg_operador) {
            tempErrors.reg_operador = "El valor es requerido";
        }
        if (newRegla.reg_operador?.toString()?.length > 10) {
            tempErrors.reg_operador = "Longitud de campo invalida max 10 caracteres [0-9a-zA-Z]";
        }
        if (!/^[+-/*=a-zA-Z0-9]*$/gm.test(newRegla.reg_operador?.toString())) {
            tempErrors.reg_operador = "El campo debe ser alfanumerico";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onSave(newRegla);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{initialData ? 'Editar Regla' : 'Agregar Nueva Regla'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Clave CUC"
                    name="reg_cuc_clave"
                    fullWidth
                    value={newRegla.reg_cuc_clave}
                    onChange={handleChange}
                    error={!!errors.reg_cuc_clave}
                    helperText={errors.reg_cuc_clave}
                    type="number"
                />

                <TextField
                    select
                    fullWidth
                    label="Clave Sistema"
                    name="reg_tit_mod_sis_clave"
                    required
                    value={newRegla.reg_tit_mod_sis_clave}
                    onChange={handleChange}
                    error={!!errors.reg_tit_mod_sis_clave}
                    helperText={errors.reg_tit_mod_sis_clave}
                >
                    {
                        sistemas?.map(sistema => <MenuItem
                            value={sistema.sis_clave}>{sistema.sis_clave} - {sistema.sis_nombre}</MenuItem>)
                    }
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Clave Módulo"
                    name="reg_tit_mod_clave"
                    required
                    value={newRegla.reg_tit_mod_clave}
                    onChange={handleChange}
                    error={!!errors.reg_tit_mod_clave}
                    helperText={errors.reg_tit_mod_clave}
                >
                    {
                        modulos?.map(modulo => <MenuItem value={modulo.mod_clave}>{modulo.mod_clave}</MenuItem>)
                    }
                </TextField>
                <TextField
                    margin="dense"
                    label="Número de Columna"
                    name="reg_tit_columna"
                    fullWidth
                    value={newRegla.reg_tit_columna}
                    onChange={handleChange}
                    type="number"
                    error={!!errors.reg_tit_columna}
                    helperText={errors.reg_tit_columna}
                />
                <TextField
                    margin="dense"
                    label="Secuencia"
                    name="reg_secuencia"
                    fullWidth
                    value={newRegla.reg_secuencia}
                    onChange={handleChange}
                    type="number"
                    error={!!errors.reg_secuencia}
                    helperText={errors.reg_secuencia}
                />
                <TextField
                    margin="dense"
                    label="Operador"
                    name="reg_operador"
                    fullWidth
                    value={newRegla.reg_operador}
                    onChange={handleChange}
                    error={!!errors.reg_operador}
                    helperText={errors.reg_operador}
                />
                <TextField
                    margin="dense"
                    label="Valor"
                    name="reg_valor"
                    fullWidth
                    value={newRegla.reg_valor}
                    onChange={handleChange}
                    error={!!errors.reg_valor}
                    helperText={errors.reg_valor}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">
                    {initialData ? 'Guardar Cambios' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCuentaRegla;
