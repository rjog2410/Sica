import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Regla } from '@/types';

interface ReglasSubpantallaModalProps {
  open: boolean;
  onClose: () => void;
  reglas: Regla[];
  onSaveRegla: (regla: Regla) => void;
  onDeleteRegla: (id: number) => void;
}

const ReglasSubpantallaModal: React.FC<ReglasSubpantallaModalProps> = ({ open, onClose, reglas, onSaveRegla, onDeleteRegla }) => {
  const [editingRegla, setEditingRegla] = useState<Regla | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newRegla, setNewRegla] = useState<Partial<Regla>>({});

  const handleEditClick = (regla: Regla) => {
    setEditingRegla(regla);
    setIsEditing(true);
  };

  const handleDeleteClick = (id: number) => {
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
      setEditingRegla({ ...editingRegla, [field]: value });
    } else {
      setNewRegla({ ...newRegla, [field]: value });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Reglas Asociadas</DialogTitle>
      <DialogContent>
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
            {reglas.map((regla) => (
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
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(regla.id)} aria-label="delete">
                    <DeleteIcon />
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
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
