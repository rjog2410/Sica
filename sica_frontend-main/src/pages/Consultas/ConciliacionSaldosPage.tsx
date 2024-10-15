import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ConciliacionTable from '../../components/base/tabla/ConciliacionTable';
import {
    fetchModulosBySistema, fetchMonedas, fetchOficinas,
    fetchReporteConciliacionSaldos,
    fetchSistemas
} from "@/pages/Reportes/conciliationService.ts";
import { useNotification } from "@/providers/NotificationProvider.tsx";

import useAuthStore from '../../store/authStore'; //para permisos
import { useNavigate } from 'react-router-dom'; //para permisos
import * as serviceInfo from '@/pages/CommonServices/commonService';



const ConciliacionSaldosPage: React.FC = () => {
    const [filtros, setFiltros] = useState({
        sistema: '',
        modulo: '',
        fecha_informacion: '',
        oficina: 90,
        moneda: 1,
    });
    const { notify } = useNotification();
    const [data, setData] = useState({
        sistemas: [],
        modulos: [],
        info: []
    })

    // Nuevo estado para indicar que está cargando
    const [isLoading, setIsLoading] = useState(false);

    const tableRef = useRef<any>(null);

    const [infoData, setInfoData] = useState<string>('');
    const { token } = useAuthStore();
    const navigate = useNavigate();
    const { hasPermission } = useAuthStore();
    const requiredPermission = '/sica/consulta/conciliacion-saldos';
    useEffect(() => {
        if (!hasPermission(requiredPermission)) {
            notify('No tienes permisos para acceder a esta página', 'error');
            navigate('/');
        }
    }, [hasPermission, navigate, notify]);

    useEffect(() => {
        fetchSistemas(token).then(resp => {
            fetchMonedas(token).then(respCurr => {
                fetchOficinas(token).then(offices => {
                    setData({ ...data, sistemas: resp, monedas: respCurr, oficinas: offices })
                    setFiltros({
                        ...filtros,
                        oficina: offices?.find(office => office?.clave_particular === 90) || 0,
                        moneda: respCurr?.find(coin => coin?.mon_clave === 1) || 0
                    })
                })
            })
        })
    }, []);

    useEffect(() => {
        if (!!filtros?.sistema) {
            fetchModulosBySistema(filtros?.sistema, token).then(resp => {
                setData({ ...data, modulos: resp })
                setFiltros({ ...filtros, modulo: '' })
            })
        }
    }, [filtros?.sistema]);


    useEffect(() => {
        const getInfo = async () => {
            try {
                const data = await serviceInfo.getInfoPantalla(requiredPermission, token);
                setInfoData(data);

            } catch (error) {
                notify('Error al cargar los datos de sistemas', 'error');
            }
        };

        getInfo();
    }, [notify]);


    const handleFiltroChange = (name: string, value: any) => {
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const searchSaldos = async () => {
        setIsLoading(true);  // Activar el estado de carga
        try {
            if (!!filtros?.oficina && !!filtros?.moneda) {
                const resp = await fetchReporteConciliacionSaldos({
                    ...filtros,
                    oficina: filtros.oficina.clave_particular,
                    moneda: filtros.moneda.mon_clave
                }, token);

                if (resp?.status !== 200) {
                    notify(resp?.message, "error");
                } else if (resp?.status === 200) {
                    if (resp?.data.length > 0) {
                        setData({ ...data, info: resp?.data });
                    } else {
                        notify('No existe información para los criterios de búsqueda seleccionados.', 'info');
                    }
                }
            } else {
                notify("Los campos de oficina y moneda son requeridos", "error");
                notify("Buscando con valores por defecto", "warning");

                const resp = await fetchReporteConciliacionSaldos({ ...filtros, oficina: 90, moneda: 1 }, token);
                // console.log("Response: ", resp);
            }
        } catch (error) {
            notify("Error en la consulta de saldos", "error");
        } finally {
            setIsLoading(false);  // Desactivar el estado de carga
        }
    };

    // const handleExportModule = () => {
    //     // Implementar la lógica para exportar por módulo
    //     console.log('Generando archivo por módulo con filtros:', filtros);
    // };

    const handleExportFile = async () => {
        if (tableRef.current) {
            try {
                const exportResult = tableRef.current.exportToExcel();
                if (exportResult instanceof Promise) {
                    exportResult.catch((error) => {
                        console.error('Error al exportar a Excel:', error);
                    });
                }
            } catch (error) {
                console.error('Error al exportar a Excel:', error);
            }
        }
    };

    return (
        <Box>
            <BodyHeader
                headerRoute="Consultas / Conciliación de Saldos"
                TitlePage="Conciliación de Saldos"
                tooltipProps={{ title: infoData }}
                typographyPropsRoute={{ variant: "h6" }}
                typographyPropsTitle={{ variant: "h3" }}
            />
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <Autocomplete
                        aria-placeholder={"Sistema"}
                        options={Array.from(new Set(data?.sistemas?.map(sistema => sistema?.sis_clave)))}
                        onChange={(_event, value) => handleFiltroChange('sistema', value || '')}
                        value={filtros?.sistema}
                        renderInput={(params) => <TextField {...params} label={"Sistema"}
                            variant="outlined" />} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        aria-placeholder={"Modulo"}
                        options={data?.modulos?.length > 0 ? Array.from(new Set(data?.modulos?.map(modulo => modulo?.mod_clave))) : []}
                        onChange={(_event, value) => handleFiltroChange('modulo', value || '')}
                        value={filtros?.modulo}
                        disabled={data?.modulos?.length <= 0}
                        renderInput={(params) => <TextField {...params} label={"Modulos"}
                            variant="outlined" />} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        type={"date"}
                        value={filtros?.fecha_informacion}
                        onChange={(e) => handleFiltroChange('fecha_informacion', e?.target?.value || '')}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}

                        label={"Fecha"}
                    />
                </Grid>
                <Grid item xs={5}>
                    <Autocomplete
                        aria-placeholder={"Oficina"}
                        options={data?.oficinas?.length > 0 ? Array.from(new Set(data?.oficinas?.map(oficina => oficina))) : []}
                        onChange={(_event, value) => handleFiltroChange('oficina', value || '')}
                        value={filtros?.oficina}
                        disabled={data?.oficinas?.length <= 0}
                        getOptionLabel={(option) => option?.clave_particular + " - " + option?.nombre}
                        renderInput={(params) => {
                            return <TextField {...params} label={"Oficina"} variant="outlined" />
                        }} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={5}>
                    <Autocomplete
                        aria-placeholder={"Monedas"}
                        options={data?.monedas?.length > 0 ? Array.from(new Set(data?.monedas?.map(moneda => moneda))) : []}
                        onChange={(_event, value) => handleFiltroChange('moneda', value || '')}
                        value={filtros?.moneda}
                        disabled={data?.monedas?.length <= 0}
                        getOptionLabel={(option) => option?.mon_clave + " - " + option?.mon_nombre}
                        renderInput={(params) => {
                            return <TextField {...params} label={"Moneda"} variant="outlined" />
                        }} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button variant="contained" color="primary" onClick={searchSaldos} sx={{ mr: 1 }} disabled={isLoading}>
                        {isLoading ? 'Buscando...' : 'Buscar'}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleExportFile}
                        disabled={isLoading || !data?.info.length}
                        sx={{ ml: 2 }}
                    >
                        {isLoading ? 'Exportando...' : 'Exportar excel'}
                    </Button>
                </Grid>
            </Grid>
            <ConciliacionTable
                ref={tableRef}
                data={data?.info}
            />
            <Box mt={2}>
                {/*<Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportModule}
                    disabled={!data?.info.length} // Deshabilitar si no hay datos filtrados
                >
                    Generar Módulo
                </Button>*/}

            </Box>
        </Box>
    );
};

export default ConciliacionSaldosPage;
