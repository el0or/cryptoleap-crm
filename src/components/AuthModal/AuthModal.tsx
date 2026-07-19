// src/components/AuthModal/AuthModal.tsx
import React, { useState } from 'react';
import { InputField } from '../InputField/InputField';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет запрос к NestJS API
    console.log('Submit:', { login, password, email, isRegister });
    onLoginSuccess(); // Имитируем успешный вход
  };

  return (
    <div className={styles.glassPanel}>
      <h2 className={styles.title}>{isRegister ? 'Регистрация' : 'Вход'}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          type="text"
          placeholder="Логин"
          value={login}
          onChange={setLogin}
        />

        {isRegister && (
          <InputField
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={setEmail}
          />
        )}

        <InputField
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={setPassword}
        />

        <div className={styles.actions}>
          <button type="button" onClick={() => setIsRegister(!isRegister)} className={styles.linkButton}>
            {isRegister ? 'Уже есть аккаунт?' : 'Зарегистрироваться'}
          </button>
          
          <button type="submit" className={styles.submitButton}>
            {isRegister ? 'Создать' : 'Войти'}
          </button>
        </div>
      </form>
    </div>
  );
};