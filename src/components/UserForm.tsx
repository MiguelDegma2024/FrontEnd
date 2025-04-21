import React, { useState, useEffect } from 'react';
import { User } from 'my-types';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    if (user) {
      // Aseguramos que todos los campos tengan valores válidos
      const { id, ...userData } = user;
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '', // No mostramos la contraseña existente por seguridad
        role: userData.role || 'user'
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si estamos editando y no se ha cambiado la contraseña, no la enviamos
    if (user && !formData.password) {
      const { password, ...dataWithoutPassword } = formData;
      onSubmit(dataWithoutPassword as Omit<User, 'id'>);
    } else {
      onSubmit(formData);
    }
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
          <label className="label">
            {user ? 'Nueva Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
          </label>
          <div className="control">
            <input
              className="input"
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              required={!user}
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
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
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