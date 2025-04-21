import React, { useState, useEffect } from 'react';
import { Branch, User } from 'my-types';

interface BranchFormProps {
  branch?: Branch;
  users: User[];
  onSubmit: (branchData: Omit<Branch, 'id'>) => void;
  onCancel: () => void;
}

const BranchForm: React.FC<BranchFormProps> = ({
  branch,
  users,
  onSubmit,
  onCancel
}) => {
  const defaultManagerId = users && users.length > 0 ? users[0].id : 0;

  const [formData, setFormData] = useState<Omit<Branch, 'id'>>({
    name: '',
    location: '',
    managerId: defaultManagerId,
  });

  useEffect(() => {
    if (branch) {
      const { id, ...branchData } = branch;
      setFormData({
        name: branchData.name || '',
        location: branchData.location || '',
        managerId: branchData.managerId || defaultManagerId,
      });
    }
  }, [branch, defaultManagerId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'managerId' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const validUsers = users.filter(user => user && user.id && user.name);

  return (
    <div className="box">
      <h2 className="title is-4">{branch ? 'Editar Sucursal' : 'Añadir Nueva Sucursal'}</h2>
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
          <label className="label">Ubicación</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Encargado</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                required
              >
                {validUsers.length === 0 ? (
                  <option value="">No hay usuarios disponibles</option>
                ) : (
                  validUsers.map(user => (
                    <option key={`user-${user.id}`} value={user.id}>
                      {user.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="field is-grouped mt-5">
          <div className="control">
            <button type="submit" className="button is-primary">
              {branch ? 'Actualizar' : 'Crear'}
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

export default BranchForm;
