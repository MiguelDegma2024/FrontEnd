import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash, faEdit, faPlus, faEye, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { Branch } from "my-types";
import { useState, useEffect } from 'react';
import { getAllBranches, deleteBranch, getBranchById, createBranch, updateBranch } from "../Api/BranchAPI";
import BranchForm from "../components/BranchForm";
import BranchDetail from "../components/BranchDetail";

interface Props {}

type ModalContent = {
  type: 'none' | 'view' | 'add' | 'edit';
  branch?: Branch;
}

const BranchPage = (_props: Props) => {
  // COMPONENT STATE
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [modal, setModal] = useState<ModalContent>({ type: 'none' });
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState({
    name: '',
    address: '',
    city: ''
  });
  
  // Fetch branches
  const fetchBranches = async () => {
    setLoading(true);
    try {
      const data = await getAllBranches();
      
      if (data && Array.isArray(data)) {
        // Filter out any null or invalid branches
        const validBranches = data.filter(item => 
          item && typeof item === 'object' && item !== null
        );
        
        setBranches(validBranches);
        setFilteredBranches(validBranches);
      } else {
        console.error("Los datos recibidos no son un array:", data);
        setBranches([]);
        setFilteredBranches([]);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]);
      setFilteredBranches([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBranches();
  }, []);
  
  // Filter handling
  useEffect(() => {
    if (!branches || branches.length === 0) {
      setFilteredBranches([]);
      return;
    }
    
    let result = [...branches];
    
    if (filter.name) {
      result = result.filter(b => 
        b && b.name && b.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }
    
    if (filter.address) {
      result = result.filter(b => 
        b && b.address && b.address.toLowerCase().includes(filter.address.toLowerCase())
      );
    }
    
    if (filter.city) {
      result = result.filter(b => 
        b && b.city && b.city.toLowerCase().includes(filter.city.toLowerCase())
      );
    }
    
    setFilteredBranches(result);
  }, [filter, branches]);
  
  // Filter change handler
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilter({
      name: '',
      address: '',
      city: ''
    });
  };
  
  // Delete branch handler
  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta sucursal?")) {
      try {
        await deleteBranch(id);
        setBranches(branches.filter(b => b.id !== id));
        alert("Sucursal eliminada con éxito");
      } catch (error) {
        console.error("Error deleting branch:", error);
        alert("Error al eliminar la sucursal");
      }
    }
  };
  
  // View branch details
  const handleViewBranch = async (id: number) => {
    try {
      const branch = await getBranchById(id);
      if (branch) {
        setModal({ type: 'view', branch });
      } else {
        throw new Error("Branch not found");
      }
    } catch (error) {
      console.error("Error fetching branch details:", error);
      alert("Error al obtener detalles de la sucursal");
    }
  };
  
  // Edit branch
  const handleEditBranch = async (id: number) => {
    try {
      const branch = await getBranchById(id);
      if (branch) {
        setModal({ type: 'edit', branch });
      } else {
        throw new Error("Branch not found");
      }
    } catch (error) {
      console.error("Error fetching branch for edit:", error);
      alert("Error al obtener la sucursal para editar");
    }
  };
  
  // Add new branch
  const handleAddBranch = () => {
    setModal({ type: 'add' });
  };
  
  // Close modal
  const closeModal = () => {
    setModal({ type: 'none' });
  };
  
  // Form submission handler
  const handleFormSubmit = async (branchData: Omit<Branch, 'id'>) => {
    try {
      if (modal.type === 'add') {
        await createBranch(branchData);
        alert("Sucursal creada con éxito");
      } else if (modal.type === 'edit' && modal.branch) {
        await updateBranch(modal.branch.id, branchData);
        alert("Sucursal actualizada con éxito");
      }
      closeModal();
      fetchBranches(); // Refresh branches list
    } catch (error) {
      console.error("Error saving branch:", error);
      alert(`Error al ${modal.type === 'add' ? 'crear' : 'actualizar'} la sucursal`);
    }
  };

  // Safe rendering helpers
  const renderBranchName = (branch: Branch) => {
    return branch && branch.name ? branch.name : 'Sin nombre';
  };

  const renderBranchAddress = (branch: Branch) => {
    return branch && branch.address ? branch.address : 'Sin dirección';
  };

  const renderBranchStatus = (branch: Branch) => {
    return branch && branch.isActive ? 
      <span className="tag is-success">Activa</span> : 
      <span className="tag is-danger">Inactiva</span>;
  };

  return (
    <>
      <nav className="panel">
        <p className="panel-heading">Todas las Sucursales</p>
        
        {/* Add Branch Button */}
        <div className="panel-block">
          <button 
            className="button is-primary is-fullwidth"
            onClick={handleAddBranch}
          >
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span>Añadir Nueva Sucursal</span>
          </button>
        </div>
        
        {/* Filters */}
        <div className="panel-block">
          <h2 className="subtitle is-5 mb-0">Filtrar Sucursales</h2>
        </div>
        
        <div className="panel-block">
          <div className="field is-grouped is-flex-wrap-wrap is-flex-grow-1">
            <div className="field is-flex-grow-1 mx-1">
              <label className="label">Nombre</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={filter.name}
                  onChange={handleFilterChange}
                  placeholder="Filtrar por nombre"
                />
              </div>
            </div>
            
            <div className="field is-flex-grow-1 mx-1">
              <label className="label">Dirección</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="address"
                  value={filter.address}
                  onChange={handleFilterChange}
                  placeholder="Filtrar por dirección"
                />
              </div>
            </div>
            
            <div className="field is-flex-grow-1 mx-1">
              <label className="label">Ciudad</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="city"
                  value={filter.city}
                  onChange={handleFilterChange}
                  placeholder="Filtrar por ciudad"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="panel-block">
          <div className="buttons">
            <button 
              className="button is-link"
              onClick={() => setFilteredBranches(branches)}
            >
              Aplicar Filtros
            </button>
            <button 
              className="button is-light"
              onClick={resetFilters}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
        
        {/* Results */}
        <div className="panel-block">
          <h2 className="subtitle is-5 mb-0">
            Resultados ({filteredBranches?.length || 0})
          </h2>
        </div>
        
        <div className="panel-block">
          {loading ? (
            <div className="is-flex is-justify-content-center is-align-items-center is-flex-grow-1 py-5">
              <span className="loader"></span>
            </div>
          ) : (
            <table className="table is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Ciudad</th>
                  <th>Código Postal</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Ciudad</th>
                  <th>Código Postal</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </tfoot>
              <tbody>
                {!filteredBranches || filteredBranches.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="has-text-centered">
                      No se encontraron sucursales
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((branch) => {
                    // Safety check for null/undefined branch
                    if (!branch) return null;
                    
                    return (
                      <tr key={branch.id}>
                        <th>{branch.id || 'N/A'}</th>
                        <td>
                          <FontAwesomeIcon icon={faBuilding} />
                        </td>
                        <td>
                          <button 
                            className="button is-ghost p-0"
                            onClick={() => branch.id && handleViewBranch(branch.id)}
                          >
                            {renderBranchName(branch)}
                          </button>
                        </td>
                        <td>{renderBranchAddress(branch)}</td>
                        <td>{branch.city || 'N/A'}</td>
                        <td>{branch.postalCode || 'N/A'}</td>
                        <td>{branch.phone || 'N/A'}</td>
                        <td>{branch.email || 'N/A'}</td>
                        <td>{renderBranchStatus(branch)}</td>
                        <td>
                          <div className="buttons are-small">
                            <button
                              className="button is-info"
                              onClick={() => branch.id && handleViewBranch(branch.id)}
                              title="Ver detalles"
                              disabled={!branch.id}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                              className="button is-warning"
                              onClick={() => branch.id && handleEditBranch(branch.id)}
                              title="Editar sucursal"
                              disabled={!branch.id}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="button is-danger"
                              onClick={() => branch.id && handleDelete(branch.id)}
                              title="Eliminar sucursal"
                              disabled={!branch.id}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </nav>
      
      {/* Modals */}
      {modal.type !== 'none' && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {modal.type === 'view' ? 'Detalles de la Sucursal' : 
                 modal.type === 'add' ? 'Añadir Sucursal' : 'Editar Sucursal'}
              </p>
              <button 
                className="delete" 
                aria-label="close"
                onClick={closeModal}
              ></button>
            </header>
            <section className="modal-card-body">
              {modal.type === 'view' && modal.branch && (
                <BranchDetail 
                  branch={modal.branch} 
                  onClose={closeModal} 
                />
              )}
              
              {(modal.type === 'add' || modal.type === 'edit') && (
                <BranchForm
                  branch={modal.type === 'edit' ? modal.branch : undefined}
                  onSubmit={handleFormSubmit}
                  onCancel={closeModal}
                />
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default BranchPage;