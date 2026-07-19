// src/pages/AuthPage/AuthPage.tsx
import React from 'react';
import { AuthModal } from '../../components/AuthModal/AuthModal';
import styles from './AuthPage.module.css';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  return (
    <div className={styles.pageWrapper}>
      {/* Декоративные анимированные элементы для преломления в стекле */}
      <div className={`${styles.blob} ${styles.blobPurple}`}></div>
      <div className={`${styles.blob} ${styles.blobBlue}`}></div>

      <header className={styles.header}>
        <h1 className={styles.logo}>CryptoLeap</h1>
      </header>

      <main className={styles.mainContent}>
        <AuthModal onLoginSuccess={onLoginSuccess} />
      </main>
    </div>
  );
};