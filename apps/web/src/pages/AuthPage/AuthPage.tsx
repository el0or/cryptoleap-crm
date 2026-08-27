import { type FormEvent, useState } from 'react';
import type { ILoginRequest, IRegisterRequest } from '@cryptoleap_crm/shared';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { useAuth } from '../../auth/useAuth';
import { ApiError } from '../../api/http';

interface InputFieldProps {
  label: string;
  type: 'text' | 'password';
  value: string;
  onChange: (value: string) => void;
}

const InputField = ({ label, type, value, onChange }: InputFieldProps) => (
  <div className={styles.inputGroup}>
    <label className={styles.label}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.input}
      placeholder={label}
      required
    />
  </div>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const payload: ILoginRequest = { email, password };
        await login(payload);
      } else {
        const payload: IRegisterRequest = { email, password };
        await register(payload);
      }

      navigate('/main');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }

      setError('Не удалось выполнить запрос');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.blurShape1}></div>
      <div className={styles.blurShape2}></div>

      <div className={styles.content}>
        <h1 className={styles.logo}>CryptoLeap</h1>

        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <h2 className={styles.title}>{isLoginMode ? 'Вход' : 'Регистрация'}</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
              <InputField label="Логин" type="text" value={email} onChange={setEmail} />
              <InputField label="Пароль" type="password" value={password} onChange={setPassword} />

              {error && (
                <div style={{ color: '#e1523c', fontSize: '13px', textAlign: 'center', marginTop: '0.5rem' }}>
                  {error}
                </div>
              )}

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Загрузка...' : isLoginMode ? 'Войти' : 'Создать аккаунт'}
              </button>
            </form>

            <a
              href="#"
              className={styles.toggleLink}
              onClick={(e) => {
                e.preventDefault();
                setIsLoginMode(!isLoginMode);
                setError(null);
              }}
            >
              {isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;