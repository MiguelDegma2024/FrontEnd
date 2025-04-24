// src/pages/RegisterPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { register, isAuthenticated } from '../Api/AuthAPI';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleRegister = async (name: string, email: string, password: string) => {
    await register(name, email, password);
  };

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box mt-6">
            <h1 className="title has-text-centered">NeoPharma</h1>
            <RegisterForm onRegister={handleRegister} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;