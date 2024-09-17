// src/pages/Reportes/ReporteConciliacionSaldosPage.tsx

import React, {useEffect, useState} from 'react';
import {Box, Button, Grid} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ReportTable from '../../components/base/tabla/ReportTable';
import ComboBox from '../../components/base/tabla/Combobox';
import {savePDF} from './pdfUtils';
import {useNotification} from '../../providers/NotificationProvider';
import {ReporteConciliacion, ReporteConciliacionFiltros} from './interfaces';
import * as service from './serviceSelector';
import {fetchSistemas} from "@/pages/Reportes/conciliationService.ts";

const ReporteConciliacionSaldosPage: React.FC = () => {

    const [filtros, setFiltros] = useState<ReporteConciliacionFiltros>({
        sistema: '',
        modulo: '',
        fecha: '',
        agrupacion: 'Cuenta',
    });
    const [reporteData, setReporteData] = useState<ReporteConciliacion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {notify} = useNotification();



    const handleFiltroChange = (name: string, value: string) => {
        setFiltros((prev) => ({...prev, [name]: value}));
    };

    const handleGenerarReporte = async () => {
        if (!filtros.sistema && !filtros.modulo && !filtros.fecha) {
            notify('Debe seleccionar al menos un filtro (Sistema, Módulo, o Fecha).', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            const data = await service.fetchReporteConciliacionSaldos(filtros);

            if (data.length === 0) {
                notify('No se encontraron datos para los filtros seleccionados.', 'warning');
            } else {
                setReporteData(data);
                notify('Reporte generado con éxito', 'success');
            }

        } catch (error: unknown) {
            if (error instanceof Error && 'response' in error && (error as any).response?.status === 404) {
                notify('Datos no encontrados.', 'error');
            } else if (error instanceof Error) {
                notify(`Error: ${error.message}`, 'error');
            } else {
                notify('Error desconocido al generar el reporte', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportarPDF = () => {
        if (reporteData.length === 0) {
            notify('No hay datos para exportar', 'warning');
            return;
        }
        savePDF(reporteData, filtros);
        notify('PDF generado exitosamente', 'success');
    };

    return (
        <Box>
            <BodyHeader
                headerRoute="Reportes / Conciliación de Saldos"
                TitlePage="Reporte Conciliación de Saldos"
                tooltipProps={{title: "Genera el reporte de conciliación de saldos"}}
                typographyPropsRoute={{variant: "h6"}}
                typographyPropsTitle={{variant: "h3"}}
            />
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                    <ComboBox
                        options={["TODOS", "SIF", "Sistema2"]}
                        onSelect={(value) => handleFiltroChange('sistema', value || '')}
                        label="Sistema"
                        getOptionLabel={(option) => option}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <ComboBox
                        options={["TODOS", "MOD1", "MOD2"]}
                        onSelect={(value) => handleFiltroChange('modulo', value || '')}
                        label="Módulo"
                        getOptionLabel={(option) => option}
                        disabled={!filtros.sistema}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <ComboBox
                        options={["2024-08-01", "2024-08-02"]}
                        onSelect={(value) => handleFiltroChange('fecha', value || '')}
                        label="Fecha"
                        getOptionLabel={(option) => option}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <ComboBox
                        options={["Cuenta", "Ente"]}
                        onSelect={(value) => handleFiltroChange('agrupacion', value || '')}
                        label="Nivel de Agrupación"
                        getOptionLabel={(option) => option}
                    />
                </Grid>
            </Grid>
            <Box mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerarReporte}
                    disabled={isLoading}
                >
                    {isLoading ? 'Generando...' : 'Generar Reporte'}
                </Button>
            </Box>
            {reporteData.length > 0 && <ReportTable data={reporteData}/>}
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleExportarPDF}
                    disabled={reporteData.length === 0}
                >
                    Exportar a PDF
                </Button>
            </Box>
        </Box>
    );
};

export default ReporteConciliacionSaldosPage;
