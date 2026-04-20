import React from 'react'

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputStyle?: React.CSSProperties;
}

const FormField: React.FC<FormFieldProps> = ({ label, type, value, onChange, inputStyle }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start',justifyContent:'center', marginBottom: '15px', width: '100%' }}>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} style={{ border: '1px solid #000', borderRadius: '4px', padding: '8px', width: '100%', ...inputStyle }} />
    </div>
  )
}

export default FormField