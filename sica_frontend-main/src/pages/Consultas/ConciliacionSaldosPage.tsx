import React, {useState, useMemo, useEffect} from 'react';
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
import {useNotification} from "@/providers/NotificationProvider.tsx";

const ConciliacionSaldosPage: React.FC = () => {
    const [filtros, setFiltros] = useState({
        sistema: '',
        modulo: '',
        fecha_informacion: '',
        oficina: 90,
        moneda: 1,
    });
    const {notify} = useNotification();
    const [data, setData] = useState({
        sistemas: [],
        modulos: [],
        info:[]
    })

    useEffect(() => {
        fetchSistemas().then(resp => {
            fetchMonedas().then( respCurr => {
                fetchOficinas().then( offices => {
                    setData({...data, sistemas: resp, monedas: respCurr, oficinas: offices})
                    setFiltros({...filtros, oficina: offices?.find(office => office?.clave_particular === 90)||0 , moneda: respCurr?.find(coin => coin?.mon_clave === 1) || 0})
                })
            })
        })
    }, []);

    useEffect(() => {
        if (!!filtros?.sistema) {
            fetchModulosBySistema(filtros?.sistema).then(resp => {
                setData({...data, modulos: resp})
                setFiltros({...filtros, modulo: ''})
            })
        }
    }, [filtros?.sistema]);


    const handleFiltroChange = (name: string, value: any) => {
        setFiltros(prev => ({...prev, [name]: value}));
    };


    const searchSaldos = ()=>{
        if (!!filtros?.oficina && !!filtros?.moneda) {
            console.log("Filtros: ",filtros)
            fetchReporteConciliacionSaldos({...filtros,oficina:filtros.oficina.clave_particular,moneda:filtros.moneda.mon_clave}).then(resp => {
                if(resp?.status !== 200){
                    notify(resp?.message,"error")
                }
                if(resp?.status === 200){
                   setData({...data, info: resp?.data})
                }
            })
        }else{
            if(!filtros?.oficina || !filtros?.moneda){
                notify("Los campos de oficina y moneda son requeridos", "error")
                notify("Buscando con valores por defecto", "warning")
                fetchReporteConciliacionSaldos({...filtros,oficina:90,moneda:1}).then(resp => {
                    console.log("Response: ", resp)
                })
            }
        }
    }

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
                        renderInput={(params) => <TextField {...params} label={"Sistema"} variant="outlined"/>} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        aria-placeholder={"Modulo"}
                        options={data?.modulos?.length > 0 ? ["TODOS",...Array.from(new Set(data?.modulos?.map(modulo => modulo?.mod_clave)))] : []}
                        onChange={(_event, value) => handleFiltroChange('modulo', value || '')}
                        value={filtros?.modulo}
                        disabled={data?.modulos?.length <= 0}
                        renderInput={(params) => <TextField {...params} label={"Modulos"} variant="outlined"/>} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        type={"date"}
                        value={filtros?.fecha_informacion}
                        onChange={(e) => handleFiltroChange('fecha_informacion', e?.target?.value || '')}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}

                        label={"Fecha"}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        aria-placeholder={"Oficina"}
                        options={data?.oficinas?.length > 0 ? ["TODOS",...Array.from(new Set(data?.oficinas?.map(oficina => oficina)))] : []}
                        onChange={(_event, value) => handleFiltroChange('oficina', value || '')}
                        value={filtros?.oficina}
                        disabled={data?.oficinas?.length <= 0}
                        getOptionLabel={(option) => option?.nombre}
                        renderInput={(params) => {
                            return <TextField {...params} label={"Oficina"} variant="outlined"/>
                        }} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        aria-placeholder={"Monedas"}
                        options={data?.monedas?.length > 0 ? ["TODOS",...Array.from(new Set(data?.monedas?.map(moneda => moneda)))] : []}
                        onChange={(_event, value) => handleFiltroChange('moneda', value || '')}
                        value={filtros?.moneda}
                        disabled={data?.monedas?.length <= 0}
                        getOptionLabel={(option) => option?.mon_nombre}
                        renderInput={(params) => {
                            return <TextField {...params} label={"Moneda"} variant="outlined"/>
                        }} // Aplicamos la propiedad sx a TextField
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button variant="contained" color="primary" onClick={searchSaldos} sx={{mr: 1}}>
                        Buscar
                    </Button>
                </Grid>
            </Grid>
            <ConciliacionTable data={data?.info} filtros={filtros}/>
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportModule}
                    disabled={!data?.info.length} // Deshabilitar si no hay datos filtrados
                >
                    Generar Módulo
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleExportFile}
                    disabled={!data?.info.length} // Deshabilitar si no hay datos filtrados
                    sx={{ml: 2}}
                >
                    Generar Archivo
                </Button>
            </Box>
        </Box>
    );
};

export default ConciliacionSaldosPage;
