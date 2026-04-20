import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputStyle?: React.CSSProperties;
}

const FormField: React.FC<FormFieldProps> = ({label, type, value, onChange, inputStyle}) => {
  const fieldId = `${label.toLowerCase().replace(/\s+/g, '-')}-field`;

  return (
    <div className='form-field'>
      <label className='form-label' htmlFor={fieldId}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea id={fieldId} className='form-textarea' value={value} onChange={onChange} style={inputStyle} />
      ) : (
        <input id={fieldId} className='form-input' type={type} value={value} onChange={onChange} style={inputStyle} />
      )}
    </div>
  );
};

export default FormField;
