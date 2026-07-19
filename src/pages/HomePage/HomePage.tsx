// src/pages/HomePage/HomePage.tsx
import React from 'react';
import styles from './HomePage.module.css';

interface HomePageProps {
  onLogout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLogout }) => {
  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>CryptoLeap CRM</div>
        <nav className={styles.navigation}>
          <div className={`${styles.navItem} ${styles.active}`}>Главная</div>
          <div className={styles.navItem}>Клиенты</div>
          <div className={styles.navItem}>Сделки</div>
        </nav>
        <button onClick={onLogout} className={styles.logoutBtn}>Выйти</button>
      </aside>
      
      <main className={styles.content}>
        <header className={styles.topBar}>
          <h2>Панель управления</h2>
        </header>
        <div className={styles.grid}>
          <div className={styles.card}>Статистика продаж</div>
          <div className={styles.card}>Активные пользователи</div>
        </div>
      </main>
    </div>
  );
};