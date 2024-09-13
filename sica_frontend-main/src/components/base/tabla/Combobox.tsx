import { Autocomplete, TextField, SxProps } from '@mui/material';
import { Theme } from '@mui/system';

interface ComboBoxProps<T> {
  options: T[];
  onSelect: (option: T | null) => void;
  label: string;
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>; // Agregamos la propiedad sx para aceptar estilos
}

function ComboBox<T>({
  options,
  onSelect,
  label,
  getOptionLabel,
  isOptionEqualToValue,
  disabled = false,
  sx, // Pasamos la propiedad sx
}: ComboBoxProps<T>) {

  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue || ((option, value) => option === value)}
      onChange={(_event, value) => onSelect(value)}
      disabled={disabled}
      sx={sx} // Aplicamos la propiedad sx a Autocomplete
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" sx={sx} />} // Aplicamos la propiedad sx a TextField
    />
  );
}

export default ComboBox;
