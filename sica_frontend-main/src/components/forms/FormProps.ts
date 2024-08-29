import { Control } from 'react-hook-form';

export interface FormInputProps {
  name: string;
  control: Control<any>;
  label?: string;
}
