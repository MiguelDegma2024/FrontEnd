// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await onLogin(formData.email, formData.password);
      // La redirección ahora ocurre en el componente padre
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="box">
      <h2 className="title is-4">Iniciar Sesión</h2>
      {error && <div className="notification is-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">Contraseña</label>
          <div className="control">
            <input
              className="input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="field is-grouped mt-5">
          <div className="control">
            <button 
              type="submit" 
              className={`button is-primary ${loading ? 'is-loading' : ''}`}
              disabled={loading}
            >
              Iniciar Sesión
            </button>
          </div>
          <div className="control">
            <button 
              type="button" 
              className="button is-link is-light"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;