// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login, isAuthenticated } from '../Api/AuthAPI';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir a la ruta principal
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    navigate('/');
  };
  
  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box mt-6">
            <h1 className="title has-text-centered">NeoPharma</h1>
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;