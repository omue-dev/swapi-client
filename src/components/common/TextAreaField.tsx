import React from 'react';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange, readOnly = false }) => (
  <div>
    <label>{label}:</label>
    <textarea value={value} onChange={onChange} readOnly={readOnly} />
  </div>
);

export default TextAreaField;
