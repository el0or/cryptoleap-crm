// src/App.tsx
import React, { useState } from 'react';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { HomePage } from './pages/HomePage/HomePage';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Компонентный подход разведения экранов на отдельные сущности
  return isAuthenticated ? (
    <HomePage onLogout={handleLogout} />
  ) : (
    <AuthPage onLoginSuccess={handleLogin} />
  );
};