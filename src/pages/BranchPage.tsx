import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faEye, faTrash, faBuilding, faMapMarkerAlt, faFilter } from "@fortawesome/free-solid-svg-icons";
import { Branch, Manager } from "my-types";
import { useState, useEffect } from 'react';
import { getAllBranches, deleteBranch, getBranchById, createBranch, updateBranch } from "../Api/BranchAPI";
import { getAllManagers } from "../Api/ManagerAPI";
import BranchForm from "../components/BranchForm";
import BranchDetail from "../components/BranchDetail";

interface Props {}

type ModalContent = {
  type: 'none' | 'view' | 'add' | 'edit';
  branch?: Branch;
}

const BranchPage = (_props: Props) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [modal, setModal] = useState<ModalContent>({ type: 'none' });
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState({ name: '', location: '' });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const data = await getAllBranches();
      setBranches(data);
      setFilteredBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]);
      setFilteredBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const data = await getAllManagers();
      setManagers(data);
    } catch (error) {
      console.error("Error fetching managers:", error);
      setManagers([]);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchManagers();
  }, []);

  useEffect(() => {
    let result = [...branches];
    
    if (filter.name) {
      result = result.filter(branch => 
        branch.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }
    
    if (filter.location) {
      result = result.filter(branch => 
        branch.location.toLowerCase().includes(filter.location.toLowerCase())
      );
    }
    
    setFilteredBranches(result);
  }, [filter, branches]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBranch = () => setModal({ type: 'add' });

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta rama?")) {
      try {
        await deleteBranch(id);
        setBranches(branches.filter(b => b.id !== id));
        alert("Rama eliminada con éxito");
      } catch (error) {
        console.error("Error deleting branch:", error);
        alert("Error al eliminar la rama");
      }
    }
  };

  const handleEditBranch = async (id: number) => {
    const branch = await getBranchById(id);
    if (branch) {
      setModal({ type: 'edit', branch });
    }
  };

  const handleViewBranch = async (id: number) => {
    const branch = await getBranchById(id);
    if (branch) {
      setModal({ type: 'view', branch });
    }
  };

  const closeModal = () => setModal({ type: 'none' });

  const handleFormSubmit = async (branchData: Omit<Branch, 'id'>) => {
    try {
      if (modal.type === 'add') {
        await createBranch(branchData);
        alert("Rama creada con éxito");
      } else if (modal.type === 'edit' && modal.branch) {
        await updateBranch(modal.branch.id, branchData);
        alert("Rama actualizada con éxito");
      }
      closeModal();
      fetchBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
      alert(`Error al ${modal.type === 'add' ? 'crear' : 'actualizar'} la rama`);
    }
  };

  return (
    <div className="fade-in">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon-background has-background-primary mr-3">
              <FontAwesomeIcon icon={faBuilding} size="lg" className="has-text-white" />
            </span>
            Gestión de Sucursales
          </p>
        </header>
        
        <div className="card-content">
          <div className="columns">
            <div className="column">
              <button 
                className="button is-primary is-fullwidth" 
                onClick={handleAddBranch}
              >
                <span className="icon"><FontAwesomeIcon icon={faPlus} /></span>
                <span>Añadir Nueva Rama</span>
              </button>
            </div>
            <div className="column">
              <button 
                className="button is-info is-fullwidth" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="icon"><FontAwesomeIcon icon={faFilter} /></span>
                <span>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="box mt-4 mb-5">
              <h2 className="subtitle is-5 mb-3">Filtrar Ramas</h2>
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control has-icons-left">
                      <input 
                        className="input" 
                        type="text" 
                        name="name" 
                        value={filter.name} 
                        onChange={handleFilterChange} 
                        placeholder="Filtrar por nombre" 
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faBuilding} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="field">
                    <label className="label">Ubicación</label>
                    <div className="control has-icons-left">
                      <input 
                        className="input" 
                        type="text" 
                        name="location" 
                        value={filter.location} 
                        onChange={handleFilterChange} 
                        placeholder="Filtrar por ubicación" 
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="buttons mt-3">
                <button className="button is-info" onClick={() => setFilteredBranches(branches)}>
                  Aplicar Filtros
                </button>
                <button className="button is-light" onClick={() => setFilter({ name: '', location: '' })}>
                  Limpiar Filtros
                </button>
              </div>
            </div>
          )}

          <div className="notification is-light is-info is-flex is-justify-content-space-between">
            <span>Total de Sucursales: <strong>{filteredBranches.length}</strong></span>
            {filter.name || filter.location ? 
              <span>Filtrando por: {filter.name ? `Nombre: "${filter.name}"` : ''} {filter.name && filter.location ? ' y ' : ''} {filter.location ? `Ubicación: "${filter.location}"` : ''}</span>
              : <span>Mostrando todas las ramas</span>
            }
          </div>

          {loading ? (
            <div className="is-flex is-justify-content-center is-align-items-center py-6">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="table-container">
              <table className="table is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Ubicación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBranches.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="has-text-centered py-5">
                        <p className="has-text-grey">No se encontraron ramas</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBranches.map(branch => (
                      <tr key={branch.id}>
                        <th>{branch.id}</th>
                        <td>
                          <button className="button is-ghost p-0 has-text-primary-dark" onClick={() => handleViewBranch(branch.id)}>
                            {branch.name}
                          </button>
                        </td>
                        <td>{branch.location}</td>
                        <td>
                          <div className="buttons are-small">
                            <button className="button is-info is-rounded" onClick={() => handleViewBranch(branch.id)}>
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button className="button is-warning is-rounded" onClick={() => handleEditBranch(branch.id)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button className="button is-danger is-rounded" onClick={() => handleDelete(branch.id)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal.type !== 'none' && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {modal.type === 'view' ? 'Detalles de la Rama' : modal.type === 'add' ? 'Añadir Rama' : 'Editar Rama'}
              </p>
              <button className="delete" aria-label="close" onClick={closeModal}></button>
            </header>
            <section className="modal-card-body">
              {modal.type === 'view' && modal.branch && (
                <BranchDetail branch={modal.branch} onClose={closeModal} />
              )}

              {(modal.type === 'add' || modal.type === 'edit') && (
                <BranchForm 
                  branch={modal.type === 'edit' ? modal.branch : undefined} 
                  Managers={managers}
                  onSubmit={handleFormSubmit} 
                  onCancel={closeModal} 
                />
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchPage;