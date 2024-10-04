import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    DialogTitle, DialogContent, Dialog, Box, IconButton
} from '@mui/material';
import {Conciliacion, ConciliacionCuenta, ConciliacionCuentaDetalle, Cuenta} from '../../../types';
import {fetchDetailConcilia} from "@/pages/Reportes/conciliationService.ts";
import ExcelJS from "exceljs";
import {saveAs} from "file-saver";

interface Props {
    data: ConciliacionCuenta[];
}

type Order = 'asc' | 'desc';

const ConciliacionTable = forwardRef(({data}: Props, ref) => {

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<any>('con_cuenta');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentReg, setCurrentReg] = useState<any>(null);
    const [detailData, setDetailData] = useState<any>(null);

    useImperativeHandle(ref, () => ({
        exportToExcel: handleExportToExcel,
    }));

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

    const handleExportToExcel = useCallback(async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cuentas');

        worksheet.columns = [
            {header: 'Cuenta Contable', key: 'cuenta', width: 20},
            {header: 'S1', key: 's1', width: 10},
            {header: 'S2', key: 's2', width: 10},
            {header: 'S3', key: 's3', width: 10},
            {header: 'S4', key: 's4', width: 10},
            {header: 'S5', key: 's5', width: 10},
            {header: 'S6', key: 's6', width: 10},
            {header: 'S7', key: 's7', width: 10},
            {header: 'Tipo Ente', key: 'tipo_ente', width: 10},
            {header: 'Ente', key: 'ente', width: 10},
            {header: 'Importe SIF', key: 'imp_sif', width: 20},
            {header: 'Importe Área', key: 'imp_area', width: 20},
            {header: 'Diferencia', key: 'dif', width: 20},
        ];

        sortedData.forEach((con) => {
            worksheet.addRow({
                cuenta: con.con_cuenta,
                s1: con.con_scta1 || 'N/A',
                s2: con.con_scta2 || 'N/A',
                s3: con.con_scta3 || 'N/A',
                s4: con.con_scta4 || 'N/A',
                s5: con.con_scta5 || 'N/A',
                s6: con.con_scta6 || 'N/A',
                s7: con.con_scta7 || 'N/A',
                tipo_ente: con.con_tipo_ente || 'N/A',
                ente: con.con_ente || 'N/A',
                imp_sif: con.con_importe_sif || 'N/A',
                imp_area: con.con_importe_ao || 'N/A',
                dif: con.con_dif || 'N/A',
            });
        });

        const today = new Date();
        const date = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
        const fileName = `ConciliacionSaldos${date}.xlsx`;

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(blob, fileName);
    }, [sortedData]);

    useEffect(() => {

    }, [paginatedData]);

    useEffect(() => {
        if (!!currentReg) {
            console.log("currentReg: ", currentReg)
            const search: ConciliacionCuentaDetalle = {
                cuc_mod_sis_clave: currentReg?.con_mod_sis_clave,
                cuc_mod_clave: currentReg?.con_mod_clave,
                cuc_cuenta: currentReg?.con_cuenta,
                cuc_scta1: currentReg?.con_scta1,
                cuc_scta2: currentReg?.con_scta2,
                cuc_scta3: currentReg?.con_scta3,
                cuc_scta4: currentReg?.con_scta4,
                cuc_tipo_ente: currentReg?.con_tipo_ente,
                cuc_ente: currentReg?.con_ente,
                con_fecha: currentReg?.con_fecha,
                oficina: currentReg?.con_oficina,
                moneda: currentReg?.con_moneda,
            }

            fetchDetailConcilia(search).then(resp => {
                setDetailData(resp)
            })
        }
    }, [currentReg]);

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cuenta Contable</TableCell>
                            <TableCell>S1</TableCell>
                            <TableCell>S2</TableCell>
                            <TableCell>S3</TableCell>
                            <TableCell>S4</TableCell>
                            <TableCell>S5</TableCell>
                            <TableCell>S6</TableCell>
                            <TableCell>S7</TableCell>
                            <TableCell>Tipo Ente</TableCell>
                            <TableCell>Ente</TableCell>
                            <TableCell>Importe SIF</TableCell>
                            <TableCell>Importe Área</TableCell>
                            <TableCell>Diferencia</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.con_cuenta}</TableCell>
                                <TableCell>{row.con_scta1}</TableCell>
                                <TableCell>{row.con_scta2}</TableCell>
                                <TableCell>{row.con_scta3}</TableCell>
                                <TableCell>{row.con_scta4}</TableCell>
                                <TableCell>{row.con_scta5}</TableCell>
                                <TableCell>{row.con_scta6}</TableCell>
                                <TableCell>{row.con_scta7}</TableCell>
                                <TableCell>{row.con_tipo_ente}</TableCell>
                                <TableCell>{row.con_ente}</TableCell>
                                <TableCell>{row.con_importe_sif}</TableCell>
                                <TableCell>{row.con_importe_ao}</TableCell>
                                <TableCell>{row.con_dif}</TableCell>
                                <TableCell><IconButton onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(!isOpen);
                                    setCurrentReg(row)
                                }} aria-label="view">
                                    🔎
                                </IconButton></TableCell>
                            </TableRow>
                        ))}
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
                    setCurrentReg(null)
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
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {
                                        detailData?.cabeceras?.map((row) => <TableCell>{row}</TableCell>)
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detailData?.datos?.map((row, index) => (
                                    <TableRow key={index}>
                                        {
                                            detailData?.cabeceras?.map((header) => <TableCell>{row[header]}</TableCell>)
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </Box>

    );
});

export default ConciliacionTable;
