import React from 'react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, readOnly = false }) => (
  <div>
    <label>{label}:</label>
    <input type="text" value={value} onChange={onChange} readOnly={readOnly} />
  </div>
);

export default TextField;
