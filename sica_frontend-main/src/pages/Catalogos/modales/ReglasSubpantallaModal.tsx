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
    Tabs, Box, Tab, Grid
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
    onDeleteRegla: (id: number) => void;
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
                                                                           onDeleteRegla
                                                                       }) => {
    const [editingRegla, setEditingRegla] = useState<Regla | null>(null);
    const [editingFormula, setEditingFormula] = useState<Formula | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isEditingFormula, setIsEditingFormula] = useState<boolean>(false);
    const [newRegla, setNewRegla] = useState<Partial<Regla>>({});
    const [value, setValue] = React.useState(0);

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

    const handleDeleteFormulaClick = (id: number) => {
        onDeleteRegla(id);
    };

    const handleSaveClick = () => {
        if (editingRegla) {
            onSaveRegla(editingRegla);
            setEditingRegla(null);
            setIsEditing(false);
        }
    };

    const handleAddClick = () => {
        const regla: Regla = {
            id: reglas.length + 1,
            clave_regla: newRegla.clave_regla || '',
            descripcion: newRegla.descripcion || '',
            reg_cuc_clave: newRegla.reg_cuc_clave || 0,
            reg_tit_mod_sis_clave: newRegla.reg_tit_mod_sis_clave || '',
            reg_tit_mod_clave: newRegla.reg_tit_mod_clave || '',
            reg_tit_columna: newRegla.reg_tit_columna || 0,
            reg_secuencia: newRegla.reg_secuencia || 0,
            reg_operador: newRegla.reg_operador || '',
            reg_valor: newRegla.reg_valor || '',
        };
        onSaveRegla(regla);
        setNewRegla({});
    };

    const handleInputChange = (field: keyof Regla, value: string | number) => {
        if (isEditing && editingRegla) {
            setEditingRegla({...editingRegla, [field]: value});
        } else {
            setNewRegla({...newRegla, [field]: value});
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Reglas Asociadas</DialogTitle>
            <DialogContent style={{ padding:"5px"}}>
                <Grid container spacing={1}  display="flex" justifyContent="center" alignItems="center">
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
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Secuencia</TableCell>
                                        <TableCell>Columna</TableCell>
                                        <TableCell>Operador</TableCell>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reglas?.map((regla) => (
                                        <TableRow key={regla.id}>
                                            <TableCell>
                                                {isEditing && editingRegla?.id === regla.id ? (
                                                    <TextField
                                                        value={editingRegla.reg_secuencia}
                                                        onChange={(e) => handleInputChange('reg_secuencia', Number(e.target.value))}
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
                                                    />
                                                ) : (
                                                    regla.reg_tit_columna
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isEditing && editingRegla?.id === regla.id ? (
                                                    <TextField
                                                        value={editingRegla.reg_operador}
                                                        onChange={(e) => handleInputChange('reg_operador', e.target.value)}
                                                    />
                                                ) : (
                                                    regla.reg_operador
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isEditing && editingRegla?.id === regla.id ? (
                                                    <TextField
                                                        value={editingRegla.reg_valor}
                                                        onChange={(e) => handleInputChange('reg_valor', e.target.value)}
                                                    />
                                                ) : (
                                                    regla.reg_valor
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEditClick(regla)} aria-label="edit">
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteClick(regla.id)}
                                                            aria-label="delete">
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell>
                                            <TextField
                                                placeholder="Secuencia"
                                                value={newRegla.reg_secuencia || ''}
                                                onChange={(e) => handleInputChange('reg_secuencia', Number(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                placeholder="Columna"
                                                value={newRegla.reg_tit_columna || ''}
                                                onChange={(e) => handleInputChange('reg_tit_columna', Number(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                placeholder="Operador"
                                                value={newRegla.reg_operador || ''}
                                                onChange={(e) => handleInputChange('reg_operador', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                placeholder="Valor"
                                                value={newRegla.reg_valor || ''}
                                                onChange={(e) => handleInputChange('reg_valor', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={handleAddClick} aria-label="add">
                                                <AddIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
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
                                <TableBody>
                                    {formulas?.map((formula) => (
                                        <TableRow key={formula.for_secuencia}>
                                            <TableCell>
                                                {isEditingFormula && editingFormula?.for_secuencia === formula.for_secuencia ? (
                                                    <TextField
                                                        value={editingFormula.for_secuencia}
                                                        onChange={(e) => handleInputChange('reg_secuencia', Number(e.target.value))}
                                                    />
                                                ) : (
                                                    formula.for_secuencia
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isEditingFormula && editingFormula?.for_secuencia === formula.for_secuencia ? (
                                                    <TextField
                                                        value={editingFormula.for_tit_columna}
                                                        onChange={(e) => handleInputChange('reg_tit_columna', Number(e.target.value))}
                                                    />
                                                ) : (
                                                    formula.for_tit_columna
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isEditingFormula && editingFormula?.for_secuencia === formula.for_secuencia ? (
                                                    <TextField
                                                        value={editingFormula.for_operador}
                                                        onChange={(e) => handleInputChange('reg_operador', e.target.value)}
                                                    />
                                                ) : (
                                                    formula.for_operador
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEditFormulaClick(formula)} aria-label="edit">
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteFormulaClick(formula.for_secuencia)}
                                                            aria-label="delete">
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell>
                                            <TextField
                                                placeholder="Secuencia"
                                                value={newRegla.reg_secuencia || ''}
                                                onChange={(e) => handleInputChange('reg_secuencia', Number(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                placeholder="Columna"
                                                value={newRegla.reg_tit_columna || ''}
                                                onChange={(e) => handleInputChange('reg_tit_columna', Number(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                placeholder="Operador"
                                                value={newRegla.reg_operador || ''}
                                                onChange={(e) => handleInputChange('reg_operador', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={handleAddClick} aria-label="add">
                                                <AddIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CustomTabPanel>

                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
                {isEditing && (
                    <Button onClick={handleSaveClick} color="primary">
                        Guardar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ReglasSubpantallaModal;
