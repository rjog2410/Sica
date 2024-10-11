import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
    Box,
    Checkbox,
    TableSortLabel,
    Dialog,
    DialogContent,
    Grid,
    TextField,
    List,
    ListSubheader,
    ListItemButton,
    ListItemIcon, ListItemText, Collapse, ListItem,
} from '@mui/material';
import {Pantalla, Usuario} from "@/types.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {fetchUsuarioPermisos} from "@/pages/Autenticacion/Usuarios/Service.tsx";


interface Props {
    data: Usuario[];
    pantallas: Pantalla[];
    onSelectionChange: (selectedIds: number[]) => void;
    onUpdateUsuario: (cuenta: Usuario) => void;
    onDeleteUsuario: (id: number) => void;
}

type Order = 'asc' | 'desc';

const UsuariosTable = forwardRef(({ data,onSelectionChange,onUpdateUsuario,onDeleteUsuario,pantallas }: Props) => {

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<Usuario>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const [openRoles, setOpenRoles] = React.useState(false);
    const [openPer, setOpenPer] = React.useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [currentPer, setCurrentPer] = useState<Pantalla[]>([]);


    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = data.map((n) => n.id);
            setSelected(newSelecteds);
            onSelectionChange(newSelecteds);
            return;
        }
        setSelected([]);
        onSelectionChange([]);
    };

    const handleRequestSort = (property: keyof Usuario) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = useMemo(() => {
        return data?.slice().sort((a, b) => {
            const aValue = a[orderBy] ?? ''
            const bValue = b[orderBy] ?? '';

            return (aValue < bValue ? -1 : 1) * (order === 'asc' ? 1 : -1);
        });
    }, [data, order, orderBy]);

    const paginatedData = useMemo(() => {
        return sortedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);


    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    useEffect(() => {
        setSelected([])
        onSelectionChange([])
    }, [paginatedData]);

    useEffect(() => {
        if (!!currentUser) {
            fetchUsuarioPermisos(currentUser?.id).then(resp => {
                if(resp?.status === 200){
                    setCurrentPer(pantallas?.filter(pant => resp?.data?.includes(pant.id_pantalla)))
                }else{
                    setCurrentPer([])
                }
            })
        }
    }, [currentUser]);

    const handleClick = () => {
        setOpenRoles(!openRoles);
    };
    const handleClickPermi = () => {
        setOpenPer(!openPer);
    };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;



    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < data.length}
                                    checked={data.length > 0 && selected.length === data.length}
                                    onChange={handleSelectAllClick}
                                    inputProps={{ 'aria-label': 'select all users' }}
                                />
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('id')}
                                />
                                Id Usuario
                            </TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Ubicación</TableCell>
                            <TableCell>Transferencia</TableCell>
                            <TableCell>Roles</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => {
                            const isItemSelected = row.id ? isSelected(row.id) : false;
                            return (
                                <TableRow key={index}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isItemSelected}
                                                  onChange={() => {
                                                      if (isItemSelected) {
                                                          setSelected(selected?.filter(item => item !== row.id))
                                                          onSelectionChange(selected?.filter(item => item !== row.id));
                                                      } else {
                                                          setSelected([...selected, row.id])
                                                          onSelectionChange([...selected, row.id]);
                                                      }
                                                  }}
                                        />
                                    </TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.nombre}</TableCell>
                                    <TableCell>{row.telefono}</TableCell>
                                    <TableCell>{row.ubicacion}</TableCell>
                                    <TableCell>{row.transferencia}</TableCell>
                                    <TableCell>{row.rolesString}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            onUpdateUsuario(row);
                                        }} aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => onDeleteUsuario(row.id!)} aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOpen(!isOpen);
                                        setCurrentUser(row);
                                    }} aria-label="view">
                                        🔎
                                    </IconButton></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={sortedData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
             <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(!isOpen)
                    setCurrentUser(null)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "900px",  // Set your width here
                        },
                    },
                }}
            >
                <DialogContent>
                    <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper', height:'100%'}}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        Información de usuario
                                    </ListSubheader>
                                }
                            >
                                <ListItem  >
                                    <TextField
                                        fullWidth
                                        label="Usuario"
                                        value={currentUser?.username}
                                        disabled={true}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        value={currentUser?.nombre}
                                        disabled={true}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Ubicacion"
                                        value={currentUser?.ubicacion}
                                        disabled={true}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Telefono"
                                        value={currentUser?.telefono}
                                        disabled={true}
                                    />
                                </ListItem>
                                <ListItem >
                                    <TextField
                                        fullWidth
                                        label="Transferencia"
                                        value={currentUser?.transferencia}
                                        disabled={true}
                                    />
                                </ListItem>
                                <ListItemButton onClick={handleClick}>
                                    <ListItemText primary="Roles" />
                                    {openRoles ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openRoles} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            currentUser?.roles?.map((role) => (
                                                <ListItem sx={{ pl: 4 }}>
                                                    <ListItemText primary={role?.nombre_rol} />
                                                </ListItem>
                                            ))
                                        }

                                    </List>
                                </Collapse>
                                <ListItemButton onClick={handleClickPermi}>
                                    <ListItemText primary="Permisos" />
                                    {openPer ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openPer} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            currentPer?.map(per =>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <ListItemText primary={per?.nombre_pantalla} />
                                                </ListItem>
                                            )
                                        }
                                    </List>
                                </Collapse>
                            </List>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    );
});

export default UsuariosTable;
