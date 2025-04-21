import React, { useState, useEffect } from 'react';
import { User } from 'my-types';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    password: '',
    role: 'user', // Definimos un valor por defecto para el rol
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        role: user.role || 'user',
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="box">
      <h2 className="title is-4">{user ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="name"
              value={formData.name || ''}
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
              value={formData.email || ''}
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
              value={formData.password || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Rol</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select
                name="role"
                value={formData.role || 'user'}
                onChange={handleChange}
                required
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field is-grouped mt-5">
          <div className="control">
            <button type="submit" className="button is-primary">
              {user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
