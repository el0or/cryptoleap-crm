import React from 'react';
import styles from './InputField.module.css';

interface InputFieldProps {
  type: 'text' | 'password' | 'email';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className={styles.wrapper}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        required
      />
    </div>
  );
};