import React, {useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, FormHelperText, MenuItem
} from '@mui/material';
import {Cuenta, ModuloO, Sistema} from '@/types';
import {fetchSistemas} from "@/pages/Catalogos/selectores/serviceSelectorSistemas.ts";
import {fetchModuloByClave} from "@/pages/Catalogos/selectores/serviceSelectorModulos.ts";
import useAuthStore from '@/store/authStore'; //para permisos

interface AddCuentaModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (cuenta: Cuenta, isUpdate: boolean) => void;
    initialData?: Cuenta | null;
}

const AddCuentaModal: React.FC<AddCuentaModalProps> = ({open, onClose, onSave, initialData}) => {


    const originalObject: Cuenta = {
        cuc_clave: 0,
        cuc_mod_sis_clave: '',
        cuc_mod_clave: '',
        cuc_cuenta: 0,
        cuc_scta1: '',
        cuc_scta2: '',
        cuc_scta3: '',
        cuc_scta4: '',
        cuc_scta5: '',
        cuc_scta6: '',
        cuc_scta7: '',
        cuc_tipo_ente: 0,
        cuc_ente: 0,
        cuc_consolida_ente: 'N',
        cuc_inc_saldo: 'N',
        cuc_inc_movs: 'N',
        cuc_inc: ''
    }
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [cuentaData, setCuentaData] = useState<Cuenta>(initialData);
    const [sistemas, setSistemas] = useState<Sistema[]>([]);
    const [modulos, setModulos] = useState<ModuloO[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const { token } = useAuthStore();
    useEffect(() => {
        fetchSistemas(token).then(resp => {
            setSistemas(resp);
        })
    }, []);

    useEffect(() => {
        fetchModuloByClave(cuentaData?.cuc_mod_sis_clave,token).then(resp => {
            setModulos(resp)
        })
    }, [cuentaData?.cuc_mod_sis_clave]);

    useEffect(() => {
        if (initialData?.cuc_clave !== 0) {
            setIsUpdate(true)
            setCuentaData({
                ...initialData,
                cuc_ente: (initialData?.cuc_ente === null || initialData?.cuc_ente === undefined) ? 0 : initialData?.cuc_ente,
                cuc_tipo_ente: (initialData?.cuc_tipo_ente === null || initialData?.cuc_tipo_ente === undefined) ? 0 : initialData?.cuc_tipo_ente,
                cuc_inc: initialData.cuc_consolida_ente === 'S' ? 'E' : (initialData.cuc_inc_movs === 'S' ? 'M' : (initialData.cuc_inc_saldo === 'S' ? 'S' : ""))
            });
        }
    }, [initialData]);

    const validate = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!cuentaData?.cuc_mod_sis_clave) {
            tempErrors.cuc_mod_sis_clave = "La clave del sistema es obligatoria";
        }
        if (!cuentaData?.cuc_mod_clave) {
            tempErrors.cuc_mod_clave = "La clave del modulo es obligatoria";
        }
        if (!cuentaData?.cuc_cuenta) {
            tempErrors.cuc_cuenta = "La cuenta es obligatoria";
        }
        if (cuentaData?.cuc_cuenta?.toString()?.length > 25) {
            tempErrors.cuc_cuenta = "Longitud de campo invalida max 25 caracteres [0-9]";
        }
        if (!/^[0-9]*$/gm.test(cuentaData?.cuc_cuenta?.toString())) {
            tempErrors.cuc_cuenta = "Solo numeros";
        }
        if (cuentaData?.cuc_tipo_ente?.toString()?.length > 2) {
            tempErrors.cuc_tipo_ente = "Longitud invalida para tipo ente";
        }
        if (!/^[0-9]*$/gm.test(cuentaData?.cuc_tipo_ente?.toString())) {
            tempErrors.cuc_tipo_ente = "Solo numeros";
        }
        if (cuentaData?.cuc_ente?.toString()?.length > 6) {
            tempErrors.cuc_ente = "Longitud invalida para tipo ente";
        }
        if (!/^[0-9]*$/gm.test(cuentaData?.cuc_ente?.toString())) {
            tempErrors.cuc_ente = "Solo numeros";
        }
        if (!cuentaData?.cuc_inc) {
            tempErrors.cuc_inc = "Requerido";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCuentaData({
            ...cuentaData,
            [name]: value,
        });
    };

    const handleConsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCuentaData({
            ...cuentaData,
            [name]: value,
            cuc_consolida_ente: value === 'E' ? 'S' : 'N',
            cuc_inc_saldo: value === 'S' ? 'S' : 'N',
            cuc_inc_movs: value === 'M' ? 'S' : 'N'
        });
    };

    const handleSave = () => {
        if (validate()) {
            onSave(cuentaData, isUpdate);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{initialData?.cuc_clave !== 0 ? 'Editar Cuenta' : 'Agregar Cuenta'}</DialogTitle>
            <DialogContent style={{padding: "15px"}}>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Clave Sistema"
                            name="cuc_mod_sis_clave"
                            value={cuentaData.cuc_mod_sis_clave}
                            onChange={handleChange}
                            required
                            error={!!errors.clave_sistema}
                            helperText={errors.clave_sistema}
                        >
                            {
                                sistemas?.map(sistema => <MenuItem
                                    value={sistema.sis_clave}>{sistema.sis_clave} - {sistema.sis_nombre}</MenuItem>)
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Clave Módulo"
                            name="cuc_mod_clave"
                            value={cuentaData.cuc_mod_clave}
                            onChange={handleChange}
                            required
                            error={!!errors.clave_modulo}
                            helperText={errors.clave_modulo}
                        >
                            {
                                modulos?.map(modulo => <MenuItem value={modulo.mod_clave}>{modulo.mod_clave}</MenuItem>)
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            label="Cuenta"
                            name="cuc_cuenta"
                            value={cuentaData.cuc_cuenta}
                            onChange={handleChange}
                            required
                            error={!!errors.cuc_cuenta}
                            helperText={errors.cuc_cuenta}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            label="S1"
                            name="cuc_scta1"
                            value={cuentaData.cuc_scta1}
                            onChange={handleChange}
                            error={!!errors.cuc_scta1}
                            helperText={errors.cuc_scta1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            label="S2"
                            name="cuc_scta2"
                            value={cuentaData.cuc_scta2}
                            onChange={handleChange}
                            error={!!errors.cuc_scta2}
                            helperText={errors.cuc_scta2}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            label="S3"
                            name="cuc_scta3"
                            value={cuentaData.cuc_scta3}
                            onChange={handleChange}
                            error={!!errors.cuc_scta3}
                            helperText={errors.cuc_scta3}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            label="S4"
                            name="cuc_scta4"
                            value={cuentaData.cuc_scta4}
                            onChange={handleChange}
                            error={!!errors.cuc_scta4}
                            helperText={errors.cuc_scta4}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            label="S5"
                            name="cuc_scta5"
                            value={cuentaData.cuc_scta5}
                            onChange={handleChange}
                            error={!!errors.cuc_scta5}
                            helperText={errors.cuc_scta5}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            label="S6"
                            name="cuc_scta6"
                            value={cuentaData.cuc_scta6}
                            onChange={handleChange}
                            error={!!errors.cuc_scta6}
                            helperText={errors.cuc_scta6}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            label="S7"
                            name="cuc_scta7"
                            value={cuentaData.cuc_scta7}
                            onChange={handleChange}
                            error={!!errors.cuc_scta7}
                            helperText={errors.cuc_scta7}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Tipo ente"
                            name="cuc_tipo_ente"
                            value={cuentaData.cuc_tipo_ente}
                            onChange={handleChange}
                            error={!!errors.cuc_tipo_ente}
                            helperText={errors.cuc_tipo_ente}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Ente"
                            name="cuc_ente"
                            value={cuentaData.cuc_ente}
                            onChange={handleChange}
                            error={!!errors.cuc_ente}
                            helperText={errors.cuc_ente}
                        />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                        <FormControl error={!!errors.cuc_inc}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Cons</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="cuc_inc"
                                value={cuentaData.cuc_inc}
                                onChange={handleConsChange}
                            >
                                <FormControlLabel value="E" control={<Radio/>} label="Ente"/>
                                <FormControlLabel value="S" control={<Radio/>} label="Saldo"/>
                                <FormControlLabel value="M" control={<Radio/>} label="Movs"/>
                            </RadioGroup>
                            <FormHelperText>{errors.cuc_inc}</FormHelperText>
                        </FormControl>
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancelar</Button>
                <Button onClick={handleSave} color="primary">Guardar</Button>
            </DialogActions>
        </Dialog>
    )
        ;
};

export default AddCuentaModal;
