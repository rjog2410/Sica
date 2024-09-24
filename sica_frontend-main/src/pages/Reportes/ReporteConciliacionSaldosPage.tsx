// src/pages/Reportes/ReporteConciliacionSaldosPage.tsx

import React, {useEffect, useState} from 'react';
import {Autocomplete, Box, Button, Grid, TextField} from '@mui/material';
import BodyHeader from '../../components/base/BodyHeader';
import ReportTable from '../../components/base/tabla/ReportTable';
import ComboBox from '../../components/base/tabla/Combobox';
import {savePDF} from './pdfUtils';
import {useNotification} from '../../providers/NotificationProvider';
import {ReporteConciliacion, ReporteConciliacionFiltros} from './interfaces';
import * as service from './serviceSelector';
import {fetchSistemas} from "@/pages/Reportes/conciliationService.ts";
import * as serviceSistema from '../Catalogos/selectores/serviceSelectorSistemas';
import * as serviceModulo from '../Catalogos/selectores/serviceSelectorModulos';
import { Sistema } from '@/types';

const ReporteConciliacionSaldosPage: React.FC = () => {

    
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();
  const [sistemas, setSistemas] = useState<Sistema[]>([]); 
  const [modulos, setModulos] = useState<String[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string>('');
  const [selectedModulo, setSelectedModulo] = useState<string>('');
  
    const [filtros, setFiltros] = useState<ReporteConciliacionFiltros>({
        sistema: '',
        modulo: '',
        fecha: '',
        agrupacion: 'Cuenta',
    });
    const [reporteData, setReporteData] = useState<ReporteConciliacion[]>([]);
    const fetchData = async () => {
        try {
        const dataSist= await serviceSistema.fetchSistemas();
        if(!!dataSist && dataSist.length>0){
          //console.log("sistemas recuperados: ",dataSist);
          setSistemas(dataSist);
          setSelectedSistema(dataSist[0].sis_clave);
          handleFiltroChange('sistema', dataSist[0].sis_clave || '');
          handleFiltroChange('modulo', '');
          setSelectedModulo('');
          setModulos([]);
        }else{
          setSistemas([]);
          setModulos([]);
          handleFiltroChange('sistema', '');
          handleFiltroChange('modulo', '');
          setSelectedSistema('');
          setSelectedModulo('');
        }
        
       
        } catch (error) {
          console.error('Error al cargar los datos de sistemas:', error);
          notify('Error al cargar los datos de columnas', 'error');
        }
      };

      const fetchDataMOduloByClaveSistema = async () => {
        try {
        const dataModXSist= await serviceModulo.fetchModuloByClave(selectedSistema);
        if(!dataModXSist || dataModXSist.length == 0 ){
          setModulos([]);
          setSelectedModulo('');
          handleFiltroChange('modulo', '');
          notify('No existen módulos para sistema: '+selectedSistema, 'info');
        }else{
          setModulos(Array.from(new Set(dataModXSist.map(obj => obj?.mod_clave))));
          setSelectedModulo(dataModXSist[0].mod_clave);
          handleFiltroChange('modulo',dataModXSist[0].mod_clave || '');
        }
       
        } catch (error) {
          console.error('Error al cargar los datos de modulos para sistema: '+selectedSistema, error);
          notify('Error al cargar los datos de modulos para clave sistema: '+selectedSistema, 'error');
        }
      };
      useEffect(() => {
        if (!!selectedSistema && selectedSistema !== '') {
          fetchDataMOduloByClaveSistema();     
        } else {      
          setModulos([]);
          setSelectedModulo('');
          handleFiltroChange('modulo', '');
        }
      }, [selectedSistema]);
    
      useEffect(() => {
        fetchData();
      }, []);

      const handleSistemaSelect = (sistema: string | null) => {
        setSelectedSistema(sistema);
        console.log(sistema);
        filtros.sistema=sistema;
         handleFiltroChange('sistema', sistema || '');
          setSelectedModulo('');
           
          
        };
      
        const handleModuloSelect = (modulo: string | null) => {
        console.log(modulo);
        filtros.modulo=modulo;
          setSelectedModulo(modulo);
          handleFiltroChange('modulo', modulo || '');
        };



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
            await service.fetchReporteConciliacionSaldos(filtros);

                notify('Reporte generado con éxito', 'success');

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
          ...prev,
          [name]: value,
        }));
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
        <Autocomplete
                    options={[...Array.from(new Set(sistemas.map(sistema => sistema.sis_clave)))]}
                    onChange={(_event, value) => handleSistemaSelect(value)}
                    value = {selectedSistema}
                    required
                    renderInput={(params) => <TextField {...params} value={selectedSistema} label="Sistema" variant="outlined" />} // Aplicamos la propiedad sx a TextField
                />
        </Grid>
        <Grid item xs={12} sm={4}>
        <Autocomplete
                    options={modulos}
                    onChange={(_event, value) =>  handleModuloSelect(value)}
                    disabled={selectedSistema === ''}
                    value = {selectedModulo}
                    required
                    renderInput={(params) => <TextField {...params} label="Módulo" value={selectedModulo} variant="outlined" />} // Aplicamos la propiedad sx a TextField
                />
        </Grid>
        <Grid item xs={12} sm={4}>
        <TextField
            label="Fecha"
            type="date"
            name="fecha"
            value={filtros.fecha}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth   
            required
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
           
        </Box>
    );
};

export default ReporteConciliacionSaldosPage;
