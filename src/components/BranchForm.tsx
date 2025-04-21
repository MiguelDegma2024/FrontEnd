import React, { useState, useEffect } from 'react';
import { Branch, Manager } from 'my-types';

interface BranchFormProps {
  branch?: Branch;
  Managers: Manager[];
  onSubmit: (branchData: Omit<Branch, 'id'>) => void;
  onCancel: () => void;
}

const BranchForm: React.FC<BranchFormProps> = ({
  branch,
  Managers,
  onSubmit,
  onCancel
}) => {
  // Verificar si hay managers disponibles
  const hasManagers = Array.isArray(Managers) && Managers.length > 0;
  
  // Solo usar un manager por defecto si hay disponibles
  const defaultManager = hasManagers ? Managers[0] : null;
  const defaultManagerId = defaultManager ? defaultManager.id : 0;

  const [formData, setFormData] = useState<Omit<Branch, 'id'>>({
    name: '',
    location: '',
    managerId: defaultManagerId,
    manager: defaultManager as Manager,
  });
  
  // Estado para manejar errores de validación
  const [formErrors, setFormErrors] = useState({
    name: '',
    location: '',
    managerId: ''
  });

  useEffect(() => {
    if (branch) {
      const { id, ...branchData } = branch;
      
      // Buscar el manager en la lista de managers disponibles
      let selectedManager = null;
      
      if (branch.manager) {
        // Si el branch ya tiene un manager, intentamos encontrarlo en la lista
        selectedManager = Managers.find(m => m.id === branch.manager?.id) || null;
      } 
      
      if (!selectedManager && branch.managerId) {
        // Si no encontramos el manager pero tenemos el ID, buscamos por ID
        selectedManager = Managers.find(m => m.id === branch.managerId) || null;
      }
      
      // Si aún no tenemos manager pero hay managers disponibles, usamos el primero
      if (!selectedManager && hasManagers) {
        selectedManager = defaultManager;
      }
      
      setFormData({
        name: branchData.name || '',
        location: branchData.location || '',
        managerId: selectedManager ? selectedManager.id : defaultManagerId,
        manager: selectedManager as Manager,
      });
    }
  }, [branch, Managers, defaultManager, defaultManagerId, hasManagers]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Limpiar el error al cambiar el campo
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    if (name === 'managerId') {
      const managerId = Number(value);
      const selectedManager = Managers.find(m => m.id === managerId) || null;
      
      setFormData(prev => ({
        ...prev,
        managerId,
        manager: selectedManager as Manager,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors = {
      name: '',
      location: '',
      managerId: ''
    };
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
      isValid = false;
    }
    
    if (!formData.location.trim()) {
      errors.location = 'La ubicación es obligatoria';
      isValid = false;
    }
    
    if (!formData.managerId) {
      errors.managerId = 'Debe seleccionar un encargado';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Si es válido, enviar los datos
      onSubmit(formData);
    }
  };

  // Verificar qué managers están disponibles para debug
  const validManagers = Array.isArray(Managers) ? 
    Managers.filter(manager => manager && manager.id && manager.name) : [];

  return (
    <div className="box">
      <h2 className="title is-4">{branch ? 'Editar Sucursal' : 'Añadir Nueva Sucursal'}</h2>
      
      {!hasManagers && (
        <div className="notification is-warning">
          <p>No hay encargados disponibles. Debes crear un encargado antes de poder crear sucursales.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input
              className={`input ${formErrors.name ? 'is-danger' : ''}`}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          {formErrors.name && <p className="help is-danger">{formErrors.name}</p>}
        </div>

        <div className="field">
          <label className="label">Ubicación</label>
          <div className="control">
            <input
              className={`input ${formErrors.location ? 'is-danger' : ''}`}
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          {formErrors.location && <p className="help is-danger">{formErrors.location}</p>}
        </div>

        <div className="field">
          <label className="label">Encargado</label>
          <div className="control">
            <div className={`select is-fullwidth ${formErrors.managerId ? 'is-danger' : ''}`}>
              <select
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                required
                disabled={!hasManagers}
              >
                {validManagers.length === 0 ? (
                  <option value="">No hay encargados disponibles</option>
                ) : (
                  validManagers.map(manager => (
                    <option key={`manager-${manager.id}`} value={manager.id}>
                      {manager.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          {formErrors.managerId && <p className="help is-danger">{formErrors.managerId}</p>}
        </div>

        <div className="field is-grouped mt-5">
          <div className="control">
            <button 
              type="submit" 
              className="button is-primary"
              disabled={!hasManagers}
            >
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