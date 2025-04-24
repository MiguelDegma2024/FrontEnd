import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onRegister(formData.name, formData.email, formData.password);
      // Si el registro es exitoso, redirigir al login
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <h2 className="title is-4">Registrar Nuevo Usuario</h2>
      {error && <div className="notification is-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

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

        <div className="field">
          <label className="label">Confirmar Contraseña</label>
          <div className="control">
            <input
              className="input"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
              Registrarse
            </button>
          </div>
          <div className="control">
            <button 
              type="button" 
              className="button is-light"
              onClick={() => navigate('/login')}
            >
              Ya tengo una cuenta
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;