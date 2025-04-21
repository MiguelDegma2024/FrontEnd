import React from 'react';
import { Branch } from 'my-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";

interface BranchDetailProps {
  branch: Branch;
  onClose: () => void;
}

const BranchDetail: React.FC<BranchDetailProps> = ({ branch, onClose }) => {
  if (!branch) {
    return (
      <div className="box">
        <h2 className="title is-4">Error: Sucursal no disponible</h2>
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
      <h2 className="title is-4">Detalles de la Sucursal</h2>

      <div className="columns">
        <div className="column is-one-quarter">
          <div className="has-text-centered mb-4">
            <span className="icon is-large">
              <FontAwesomeIcon icon={faBuilding} size="5x" />
            </span>
          </div>
        </div>

        <div className="column">
          <div className="content">
            <p><strong>ID:</strong> {branch.id || 'N/A'}</p>
            <p><strong>Nombre:</strong> {branch.name || 'Sin nombre'}</p>
            <p><strong>Ubicación:</strong> {branch.location || 'Sin ubicación'}</p>
            <p><strong>Gerente:</strong> {branch.managerId ? `Manager ID: ${branch.managerId}` : 'No asignado'}</p>
            <p><strong>Creado:</strong> {branch.createdAt ? new Date(branch.createdAt).toLocaleString() : 'N/A'}</p>
            <p><strong>Actualizado:</strong> {branch.updatedAt ? new Date(branch.updatedAt).toLocaleString() : 'N/A'}</p>
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

export default BranchDetail;
