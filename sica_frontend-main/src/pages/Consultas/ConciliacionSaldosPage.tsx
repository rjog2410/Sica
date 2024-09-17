import React, {useState, useMemo, useEffect} from 'react';
import {Autocomplete, Box, Button, Grid, TextField} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import {conciliacionesMock} from '../../mock/conciliacionesMock';
import ConciliacionTable from '../../components/base/tabla/ConciliacionTable';
import {
    fetchModulosBySistema,
    fetchReporteConciliacionSaldos,
    fetchSistemas
} from "@/pages/Reportes/conciliationService.ts";

const ConciliacionSaldosPage: React.FC = () => {
    const [filtros, setFiltros] = useState({
        sistema: '',
        modulo: '',
        fecha_informacion: '',
        oficina: '',
        moneda: '',
    });
    const [data, setData] = useState({
        sistemas: [],
        modulos: []
    })

    useEffect(() => {
        fetchSistemas().then(resp => {
            setData({...data, sistemas: resp})
        })
    }, []);

    useEffect(() => {
        if (!!filtros?.sistema) {
            fetchModulosBySistema(filtros?.sistema).then(resp => {
                setData({...data, modulos: resp})
            })
        }
    }, [filtros?.sistema]);


    const handleFiltroChange = (name: string, value: any) => {
        console.log("Value: ", value)
        setFiltros(prev => ({...prev, [name]: value}));
    };

    // Memorizar la conciliación filtrada para evitar recalcular en cada render
    const conciliacionesFiltradas = useMemo(() => {
        console.log("Filtros: ",filtros)
        if (!!filtros?.sistema && !!filtros?.modulo && !!filtros?.fecha_informacion && !!filtros?.oficina && !!filtros?.moneda) {
            fetchReporteConciliacionSaldos(filtros).then(resp => {
                console.log("Response: ", resp)
            })
        }
        return conciliacionesMock?.filter((item) => {
            return (
                (filtros.sistema === '' || item.sistema === filtros.sistema) &&
                (filtros.modulo === '' || item.modulo === filtros.modulo) &&
                (filtros.fecha_informacion === '' || item.fecha === filtros.fecha_informacion) &&
                (filtros.oficina === -1 || item.oficina === filtros.oficina) &&
                (filtros.moneda === -1 || item.moneda === filtros.moneda)
            );
        });
    }, [filtros]);

    const handleExportModule = () => {
        // Implementar la lógica para exportar por módulo
        console.log('Generando archivo por módulo con filtros:', filtros);
    };

    const handleExportFile = () => {
        // Implementar la lógica para exportar por sistema
        console.log('Generando archivo por sistema con filtros:', filtros);
    };

    return (
        <Box>
            <BodyHeader
                headerRoute="Consultas / Conciliación de Saldos"
                TitlePage="Conciliación de Saldos"
                tooltipProps={{title: "Consulta de Conciliación de Saldos"}}
                typographyPropsRoute={{variant: "h6"}}
                typographyPropsTitle={{variant: "h3"}}
            />
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <Autocomplete
                        aria-placeholder={"Sistema"}
                        options={Array.from(new Set(data?.sistemas?.map(sistema => sistema?.sis_clave)))}
                        onChange={(_event, value) => handleFiltroChange('sistema', value || '')}
                        value={filtros?.sistema}
                        renderInput={(params) => <TextField {...params} label={filtros?.sistema}
                                                            variant="outlined"/>} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        aria-placeholder={"Modulo"}
                        options={Array.from(new Set(data?.modulos?.map(modulo => modulo?.mod_clave)))}
                        onChange={(_event, value) => handleFiltroChange('modulo', value || '')}
                        value={filtros?.modulo}
                        renderInput={(params) => <TextField {...params} label={filtros?.modulo}
                                                            variant="outlined"/>} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        placeholder={"Fecha"}
                        type={"date"}
                        value={filtros?.fecha_informacion}
                        onChange={(e) => handleFiltroChange('fecha_informacion', e?.target?.value || '')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        placeholder={"Oficina"}
                        type={"text"}
                        value={filtros?.oficina}
                        onChange={(e) => handleFiltroChange('oficina', e?.target?.value || '')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        placeholder={"Moneda"}
                        type={"number"}
                        value={filtros?.moneda}
                        onChange={(e) => handleFiltroChange('moneda', e?.target?.value || '')}
                    />
                </Grid>
            </Grid>
            <ConciliacionTable data={conciliacionesFiltradas}/>
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportModule}
                    disabled={!conciliacionesFiltradas.length} // Deshabilitar si no hay datos filtrados
                >
                    Generar Módulo
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleExportFile}
                    disabled={!conciliacionesFiltradas.length} // Deshabilitar si no hay datos filtrados
                    sx={{ml: 2}}
                >
                    Generar Archivo
                </Button>
            </Box>
        </Box>
    );
};

export default ConciliacionSaldosPage;
