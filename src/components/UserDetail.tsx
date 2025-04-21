import React from 'react';
import { User } from 'my-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface UserDetailProps {
  user: User;
  onClose: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose }) => {
  // Asegurar que user sea válido
  if (!user) {
    return (
      <div className="box">
        <h2 className="title is-4">Error: Usuario no disponible</h2>
        <div className="field mt-5">
          <div className="control">
            <button className="button is-info" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box">
      <h2 className="title is-4">Detalles del Usuario</h2>
      
      <div className="columns">
        <div className="column is-one-quarter">
          <div className="has-text-centered mb-4">
            <span className="icon is-large">
              <FontAwesomeIcon icon={faUser} size="5x" />
            </span>
          </div>
        </div>
        
        <div className="column">
          <div className="content">
            <p><strong>ID:</strong> {user.id || 'N/A'}</p>
            <p><strong>Nombre:</strong> {user.name || 'Sin nombre'}</p>
            <p><strong>Email:</strong> {user.email || 'Sin email'}</p>
            <p><strong>Rol:</strong> {user.role || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div className="field mt-5">
        <div className="control">
          <button className="button is-info" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;