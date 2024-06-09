import React from 'react';
import { Switch } from '@mui/material';

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SwitchField: React.FC<SwitchFieldProps> = ({ label, checked, onChange }) => (
  <div>
    <label>{label}:</label>
    <Switch checked={checked} onChange={onChange} />
  </div>
);

export default SwitchField;
