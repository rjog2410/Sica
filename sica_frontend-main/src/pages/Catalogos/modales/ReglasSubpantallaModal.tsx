import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Tabs, Box, Tab, Grid, Checkbox, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {Cuenta, Formula, Regla} from '@/types';

interface ReglasSubpantallaModalProps {
    open: boolean;
    onClose: () => void;
    reglas: Regla[];
    formulas: Formula[];
    cuenta: Cuenta;
    onSaveRegla: (regla: Regla) => void;
    onSaveFormula: (formula: Formula) => void;
    onDeleteRegla: (id: number) => void;
    onDeleteAllReglas: (ids: number[]) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ReglasSubpantallaModal: React.FC<ReglasSubpantallaModalProps> = ({
                                                                           open,
                                                                           onClose,
                                                                           reglas,
                                                                           formulas,
                                                                           cuenta,
                                                                           onSaveRegla,
                                                                           onSaveFormula,
                                                                           onDeleteRegla,
                                                                           onDeleteAllReglas
                                                                       }) => {
    const [editingRegla, setEditingRegla] = useState<Regla | null>(null);
    const [editingFormula, setEditingFormula] = useState<Formula | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isEditingFormula, setIsEditingFormula] = useState<boolean>(false);
    const [newRegla, setNewRegla] = useState<Partial<Regla>>({
        reg_cuc_clave: cuenta.cuc_clave,
        reg_tit_mod_clave: cuenta.cuc_mod_clave,//Deberia ser el titulo del modulo no su clave?
        reg_tit_mod_sis_clave: cuenta.cuc_mod_sis_clave,//Deberia ser el titulo del sistema no su clave?
    });
    const [newFormula, setNewFormula] = useState<Partial<Formula>>({});
    const [value, setValue] = React.useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [checked, setChecked] = React.useState(false);

    const [selectedReglas, setSelectedReglas] = useState<Partial<number[]>>([]);

    const operators: string[] = ["+","-","*","/"];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleEditClick = (regla: Regla) => {

        setEditingRegla(regla);
        setIsEditing(true);
    };

    const handleEditFormulaClick = (formula: Formula) => {
        setEditingFormula(formula);
        setIsEditingFormula(true);
    };

    const handleDeleteClick = (id: number) => {
        onDeleteRegla(id);
    };

    const handleSaveClick = () => {
        if (editingRegla && validateNewRegla(editingRegla)) {
            onSaveRegla(editingRegla);
            setEditingRegla(null);
            setIsEditing(false);
        } else if (editingFormula && validateNewFormula(editingFormula)) {
            onSaveFormula(editingFormula);
            setEditingFormula(null);
            setIsEditingFormula(false)
        }
    };

    const handleAddClick = () => {
        if (validateNewRegla(newRegla)) {
            const regla: Regla = {
                id: reglas.length + 1,
                clave_regla: newRegla.clave_regla || '',
                descripcion: newRegla.descripcion || '',
                reg_cuc_clave: cuenta.cuc_clave || 0,
                reg_tit_mod_sis_clave: cuenta.cuc_mod_sis_clave || '',
                reg_tit_mod_clave: cuenta.cuc_mod_clave || '',
                reg_tit_columna: newRegla.reg_tit_columna || 0,
                reg_secuencia: newRegla.reg_secuencia || 0,
                reg_operador: newRegla.reg_operador || '',
                reg_valor: newRegla.reg_valor || '',
            };
            onSaveRegla(regla);
            setNewRegla({});
        }

    };

    const handleAddFormulaClick = () => {
        if (validateNewFormula(newFormula)) {
            const formula: Formula = {
                id: formulas.length + 1,
                for_cuc_clave: cuenta.cuc_clave || 0,
                for_tit_mod_sis_clave: cuenta.cuc_mod_sis_clave || '',
                for_tit_mod_clave: cuenta.cuc_mod_clave?.toString() || '',
                for_tit_columna: newFormula.for_tit_columna || 0,
                for_secuencia: newFormula.for_secuencia || 0,
                for_operador: newFormula.for_operador || ''
            };
            onSaveFormula(formula);
            setNewFormula({});
        }
    };

    const validateNewRegla = (regla: Regla) => {
        let tempErrors: { [key: string]: string } = {};

        if (!regla?.reg_secuencia) {
            tempErrors.reg_secuencia = "Campo obligatorio";
        }
        if (regla?.reg_secuencia?.toString()?.length > 6) {
            tempErrors.reg_secuencia = "Longitud invalida max 6 ";
        }
        if (!regla?.reg_tit_columna) {
            tempErrors.reg_tit_columna = "Campo obligatorio";
        }
        if (regla?.reg_tit_columna?.toString()?.length > 2) {
            tempErrors.reg_tit_columna = "Longitud invalida max 2 ";
        }
        if (!regla?.reg_operador) {
            tempErrors.reg_operador = "Campo obligatorio";
        }
        if (!regla?.reg_valor) {
            tempErrors.reg_valor = "Campo obligatorio";
        }
        if (regla?.reg_valor?.toString()?.length > 2) {
            tempErrors.reg_valor = "Longitud invalida max 2 ";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const validateNewFormula = (formula: Formula) => {
        let tempErrors: { [key: string]: string } = {};

        if (!formula?.for_secuencia) {
            tempErrors.for_secuencia = "Campo obligatorio";
        }
        if (formula?.for_secuencia?.toString()?.length > 6) {
            tempErrors.for_secuencia = "Longitud invalida max 6 ";
        }
        if (!formula?.for_tit_columna) {
            tempErrors.for_tit_columna = "Campo obligatorio";
        }
        if (formula?.for_tit_columna?.toString()?.length > 2) {
            tempErrors.for_tit_columna = "Longitud invalida max 2 ";
        }
        if (!formula?.for_operador) {
            tempErrors.for_operador = "Campo obligatorio";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (field: keyof Regla, value: string | number) => {
        if (isEditing && editingRegla) {
            setEditingRegla({...editingRegla, [field]: value});
        } else {
            setNewRegla({...newRegla, [field]: value});
        }
    };

    const handleInputFormulaChange = (field: keyof Formula, value: string | number) => {
        console.log(editingFormula && isEditingFormula)
        if (editingFormula && isEditingFormula) {
            setEditingFormula({...editingFormula, [field]: value});
        } else {
            setNewFormula({...newFormula, [field]: value});
        }
    };

    const handleSelectRegla = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        console.log("isChecked: ", event.target.checked, "id: ", id)
        if (event.target.checked) {
            setSelectedReglas([...selectedReglas, id])
        } else {
            setSelectedReglas(selectedReglas?.filter(regla => regla !== id))
        }
    };

    const handleSelectAllRegla = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedReglas(reglas.map(regla => regla.id))
        } else {
            setSelectedReglas([])
        }
        setChecked(event.target.checked)
    };

    const isCurrentFormula = (formula: Formula) => isEditingFormula && formula.id === editingFormula?.id


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Reglas / Formulas Asociadas</DialogTitle>
            <DialogContent style={{padding: "5px"}}>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Sitema"
                            value={cuenta.cuc_mod_sis_clave}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Modulo"
                            value={cuenta.cuc_mod_clave}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Cuenta"
                            value={cuenta.cuc_cuenta}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Tabs value={value} onChange={handleChange} aria-label="Cuentas - Reglas - Formulas">
                            <Tab label="Reglas" {...a11yProps(0)} />
                            <Tab label="Formulas" {...a11yProps(1)} />
                        </Tabs>

                        <CustomTabPanel value={value} index={0}>
                            {selectedReglas.length > 0 &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        onDeleteAllReglas(selectedReglas)
                                        setSelectedReglas([])
                                    }}
                                    sx={{mr: 1}}>
                                    Eliminar seleccionados
                                </Button>}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox
                                                checked={checked}
                                                onChange={(e) => handleSelectAllRegla(e)}
                                                inputProps={{'aria-label': 'controlled'}}
                                            />
                                        </TableCell>
                                        <TableCell>Secuencia</TableCell>
                                        <TableCell>Columna</TableCell>
                                        <TableCell>Operador</TableCell>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        !isEditing && <TableRow>
                                            <TableCell>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    placeholder="Secuencia"
                                                    value={newRegla.reg_secuencia || ''}
                                                    onChange={(e) => handleInputChange('reg_secuencia', Number(e.target.value))}
                                                    error={!!errors.reg_secuencia}
                                                    helperText={errors.reg_secuencia}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    placeholder="Columna"
                                                    value={newRegla.reg_tit_columna || ''}
                                                    onChange={(e) => handleInputChange('reg_tit_columna', Number(e.target.value))}
                                                    error={!!errors.reg_tit_columna}
                                                    helperText={errors.reg_tit_columna}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    select
                                                    placeholder="Operador"
                                                    value={newRegla.reg_operador || ''}
                                                    onChange={(e) => handleInputChange('reg_operador', e.target.value)}
                                                    error={!!errors.reg_operador}
                                                    helperText={errors.reg_operador}
                                                >
                                                    {
                                                        operators?.map(op => <MenuItem
                                                            value={op}>{op}</MenuItem>)
                                                    }
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    placeholder="Valor"
                                                    value={newRegla.reg_valor || ''}
                                                    onChange={(e) => handleInputChange('reg_valor', e.target.value)}
                                                    error={!!errors.reg_valor}
                                                    helperText={errors.reg_valor}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={handleAddClick} aria-label="add">
                                                    <AddIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    }

                                    {reglas?.map((regla) => (
                                        <TableRow key={regla.id}>
                                            <TableCell>
                                                {!(isEditing && editingRegla?.id === regla.id) && (
                                                    <Checkbox
                                                        checked={selectedReglas.includes(regla.id)}
                                                        onChange={(e) => handleSelectRegla(e, regla.id)}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />
                                                )
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {isEditing && editingRegla?.id === regla.id ? (
                                                    <TextField
                                                        value={editingRegla.reg_secuencia}
                                                        onChange={(e) => handleInputChange('reg_secuencia', Number(e.target.value))}
                                                        error={!!errors.reg_secuencia}
                                                        helperText={errors.reg_secuencia}
                                                    />
                                                ) : (
                                                    regla.reg_secuencia
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isEditing && editingRegla?.id === regla.id ? (
                                                    <TextField
                                                        value={editingRegla.reg_tit_columna}
                                                        onChange={(e) => handleInputChange('reg_tit_columna', Number(e.target.value))}
                                                        error={!!errors.reg_tit_columna}
                                                        helperText={errors.reg_tit_columna}
                                                    />
                                                ) : (
                                                    regla.reg_tit_columna
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isEditing && editingRegla?.id === regla.id ? (
                                                    <TextField
                                                        select
                                                        value={editingRegla.reg_operador}
                                                        onChange={(e) => handleInputChange('reg_operador', e.target.value)}
                                                        error={!!errors.reg_operador}
                                                        helperText={errors.reg_operador}
                                                    >
                                                        {
                                                            operators?.map(op => <MenuItem
                                                                value={op}>{op}</MenuItem>)
                                                        }
                                                    </TextField>
                                                ) : (
                                                    regla.reg_operador
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isEditing && editingRegla?.id === regla.id ? (
                                                    <TextField
                                                        value={editingRegla.reg_valor}
                                                        onChange={(e) => handleInputChange('reg_valor', e.target.value)}
                                                        error={!!errors.reg_valor}
                                                        helperText={errors.reg_valor}
                                                    />
                                                ) : (
                                                    regla.reg_valor
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    !isEditing &&
                                                    <IconButton onClick={() => handleEditClick(regla)}
                                                                aria-label="edit">
                                                        <EditIcon/>
                                                    </IconButton>
                                                }
                                                {
                                                    !isEditing &&
                                                    <IconButton onClick={() => handleDeleteClick(regla.id)}
                                                                aria-label="delete">
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                }

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Secuencia</TableCell>
                                        <TableCell>Columna</TableCell>
                                        <TableCell>Operador</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            placeholder="Secuencia"
                                            value={newFormula.for_secuencia || ''}
                                            onChange={(e) => handleInputFormulaChange('for_secuencia', Number(e.target.value))}
                                            error={!!errors.for_secuencia}
                                            helperText={errors.for_secuencia}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            placeholder="Columna"
                                            value={newFormula.for_tit_columna || ''}
                                            onChange={(e) => handleInputFormulaChange('for_tit_columna', Number(e.target.value))}
                                            error={!!errors.for_tit_columna}
                                            helperText={errors.for_tit_columna}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            select
                                            placeholder="Operador"
                                            value={newFormula.for_operador || ''}
                                            onChange={(e) => handleInputFormulaChange('for_operador', e.target.value)}
                                            error={!!errors.for_operador}
                                            helperText={errors.for_operador}
                                        >
                                            {
                                                operators?.map(op => <MenuItem
                                                    value={op}>{op}</MenuItem>)
                                            }
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={handleAddFormulaClick} aria-label="add">
                                            <AddIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableBody>
                                    {formulas?.map((formula) => (
                                        <TableRow key={formula.for_secuencia}>
                                            <TableCell>
                                                {isCurrentFormula(formula) ? (
                                                    <TextField
                                                        value={editingFormula?.for_secuencia}
                                                        onChange={(e) => handleInputFormulaChange('for_secuencia', Number(e.target.value))}
                                                        error={!!errors.for_secuencia}
                                                        helperText={errors.for_secuencia}
                                                    />
                                                ) : (
                                                    formula.for_secuencia
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isCurrentFormula(formula) ? (
                                                    <TextField
                                                        value={editingFormula?.for_tit_columna}
                                                        onChange={(e) => handleInputFormulaChange('for_tit_columna', Number(e.target.value))}
                                                        error={!!errors.for_tit_columna}
                                                        helperText={errors.for_tit_columna}
                                                    />
                                                ) : (
                                                    formula.for_tit_columna
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isCurrentFormula(formula) ? (
                                                    <TextField
                                                        value={editingFormula?.for_operador}
                                                        onChange={(e) => handleInputFormulaChange('for_operador', e.target.value)}
                                                        error={!!errors.for_operador}
                                                        helperText={errors.for_operador}
                                                    >
                                                        {
                                                            operators?.map(op => <MenuItem
                                                                value={op}>{op}</MenuItem>)
                                                        }
                                                    </TextField>
                                                ) : (
                                                    formula.for_operador
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEditFormulaClick(formula)}
                                                            aria-label="edit">
                                                    <EditIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CustomTabPanel>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setIsEditingFormula(false)
                    setIsEditing(false)
                    onClose()
                }} color="primary">
                    Cerrar
                </Button>
                {(isEditing || isEditingFormula) && (
                    <Button onClick={handleSaveClick} color="primary">
                        Guardar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ReglasSubpantallaModal;
