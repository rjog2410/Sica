import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Select, MenuItem, TextField, FormControl, InputLabel, Checkbox, FormControlLabel, SelectChangeEvent } from '@mui/material';
import { ExtraccionParams } from '../../types';
import { sistemasMock, modulosMock } from './serviceSelectorExtraccionSIF';
import * as service from './serviceSelectorExtraccionSIF';
import { useNotification } from '../../providers/NotificationProvider';
import BodyHeader from '../../components/base/BodyHeader';
import { Modulo } from '@/utils/types';
import ComboBox from '@/components/base/tabla/Combobox';

const ExtraccionSIFPage: React.FC = () => {
  const originalObject = {
    sistema: '',
    modulo: '',
    tipo_informacion: '',
    fecha_inicial: '',
    fecha_final: '',
    borrar_info: '',
  }
  const [params, setParams] = useState<ExtraccionParams>({
    sistema: 'TODOS',
    modulo: 'TODOS',
    tipo_informacion: '',
    fecha_inicial: '',
    fecha_final: '',
    borrar_info: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [selectedSistema, setSelectedSistema] = useState<string | null>('TODOS');
  const [secondFilterOptions, setSecondFilterOptions] = useState<string[]>([]);
  const [selectedModulo, setSelectedModulo] = useState<string>('TODOS');
  
  const [filterValue, setFilterValue] = useState<string>('TODOS');


  const { notify } = useNotification();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await service.fetchModulos()
        setModulos(data);
        notify('Datos de Extracción SIF Cargados', 'info');
      } catch (error) {
        notify('Error al cargar los datos de Extracción SIF', 'error');
      } 
    };

    fetchData();
  }, [notify]);

  const handleSistemaSelect = (sistema: string | null) => {
    setSelectedSistema(sistema);
    if (sistema && sistema !== 'TODOS') {
      const filteredModules = modulos.filter(m => m.clave_sistema === sistema);
      const newOptions = ['TODOS', ...new Set(filteredModules.map(m => m.clave_modulo))];
      params.sistema=sistema;
      setSecondFilterOptions(newOptions);
      setSelectedModulo('TODOS');
    } else {
      setSecondFilterOptions([]);
      setSelectedModulo('TODOS');
    }
  };

  const handleModuloSelect = (modulo: string | null) => {
    
    params.modulo=modulo;
    setSelectedModulo(modulo || 'TODOS');
    setFilterValue(modulo ? modulo : 'TODOS');

  };

  const filteredModulos = modulos.filter(modulo => {
    const matchSistema = selectedSistema === 'TODOS' || modulo.clave_sistema === selectedSistema;
    const matchModulo = selectedModulo === 'TODOS' || modulo.clave_modulo === selectedModulo;
    return matchSistema && matchModulo;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const validateParams = (): boolean => {
    var fecha =params.fecha_inicial?.split("-");
    

    console.log(fecha[2])

    if (fecha[2] !== '01') {
      notify('La fecha de inicio debe ser el primer día del mes', 'error');
      return false;
    }

    if (params.fecha_final < params.fecha_inicial) {
      notify('La fecha final debe ser mayor o igual a la fecha de inicio', 'error');
      return false;
    }

    return true;
  };

  const handleExecute = async () => {
    if (!validateParams()) return;
    setIsLoading(true);
      await service.executeExtraccionSIF(params).then(resp =>{
        console.log("",resp)
        if(resp.status === 200){

            notify('Módulo agregado correctamente', 'success');
          

        }else{
          notify(resp.message, 'info');
          console.log("ocurrio un error: ",resp.message);
        }
         }).catch(error =>{
        notify(error.response.data.message, 'error');
        console.log("ocurrio un error",error.response.data.message);
      }) 
     setParams(originalObject);
     setSelectedSistema('TODOS');
     setSecondFilterOptions([]);
     setSelectedModulo('TODOS');
     setIsLoading(false);

  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setParams((prev) => ({
      ...prev,
      [name!]: value === 'TODOS' ? '%' : value, // Asignamos "%" si selecciona "TODOS"
    }));
  };


  return (
    
    <Box sx={{ p: 3 }}>
      <BodyHeader
        headerRoute="Procesos / Extracción SIF"
        TitlePage="Extracción SIF"
        tooltipProps={{ title: "Información sobre la ejecución del proceso de Extracción SIF" }}
        typographyPropsRoute={{ variant: "h6" }}
        typographyPropsTitle={{ variant: "h3" }}
      />
 <Box mb={2}>
            <ComboBox
              options={['TODOS', ...Array.from(new Set(modulos.map(modulo => modulo.clave_sistema)))]}
              onSelect={handleSistemaSelect}
              label="Seleccione un Sistema"
              value={selectedSistema}
              getOptionLabel={(option: string) => option}
            />
          </Box>
          <Box mb={2}>
            <ComboBox
              options={secondFilterOptions}
              onSelect={handleModuloSelect}
              label="Filtrar por Clave de Módulo"
              getOptionLabel={(option: string) => option}
              disabled={selectedSistema === 'TODOS' || secondFilterOptions.length === 0}
            />
          </Box>
          <Box mb={2}>
          <TextField
            select
            label="Tipo Información"
            name="tipo_informacion"
            required 

          value={params.tipo_informacion}
            onChange={handleSelectChange}
            fullWidth
          >
             <MenuItem value="S">Saldos</MenuItem>
             <MenuItem value="M">Movimientos</MenuItem>
          </TextField>
        </Box>
        <Box mb={2}>
        <TextField
        label="Fecha Inicio"
        type="date"
        name="fecha_inicial"
        required 
        value={params.fecha_inicial}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
        </Box>
        <Box mb={2}>
        <TextField
        label="Fecha Fin"
        type="date"
        name="fecha_final"
        value={params.fecha_final}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        required 
        margin="normal"
      />
      
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Borrar Información"
            name="borrar_info"
            value={params.borrar_info}
            required 

            onChange={handleSelectChange}
            fullWidth
          >
              <MenuItem value="S">Si</MenuItem>
              <MenuItem value="N">No</MenuItem>
          </TextField>
        </Box>
      
      <Box sx={{ mt: 3 }}>
        <Button 
        variant="contained" 
        color="primary" 
        onClick={handleExecute}
        disabled={isLoading}
>
{isLoading ? 'Ejecutando...' : 'Ejecutar'}
        </Button>
      </Box>
    </Box>
  );
};

export default ExtraccionSIFPage;
