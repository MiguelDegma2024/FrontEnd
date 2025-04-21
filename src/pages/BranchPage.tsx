import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [modal, setModal] = useState<ModalContent>({ type: 'none' });
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState({ name: '', location: '' });

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

  useEffect(() => {
    fetchBranches();
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
    if (confirm("¿Estás seguro de que deseas eliminar esta rama?")) {
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
    <>
      <nav className="panel">
        <p className="panel-heading">Todas las Ramas</p>
        
        <div className="panel-block">
          <button className="button is-primary is-fullwidth" onClick={handleAddBranch}>
            <span className="icon"><FontAwesomeIcon icon={faPlus} /></span>
            <span>Añadir Nueva Rama</span>
          </button>
        </div>

        <div className="panel-block">
          <h2 className="subtitle is-5 mb-0">Filtrar Ramas</h2>
        </div>

        <div className="panel-block">
          <div className="field is-grouped is-flex-wrap-wrap is-flex-grow-1">
            <div className="field is-flex-grow-1 mx-1">
              <label className="label">Nombre</label>
              <div className="control">
                <input className="input" type="text" name="name" value={filter.name} onChange={handleFilterChange} placeholder="Filtrar por nombre" />
              </div>
            </div>

            <div className="field is-flex-grow-1 mx-1">
              <label className="label">Ubicación</label>
              <div className="control">
                <input className="input" type="text" name="location" value={filter.location} onChange={handleFilterChange} placeholder="Filtrar por ubicación" />
              </div>
            </div>
          </div>
        </div>

        <div className="panel-block">
          <div className="buttons">
            <button className="button is-link" onClick={() => setFilteredBranches(branches)}>Aplicar Filtros</button>
            <button className="button is-light" onClick={() => setFilter({ name: '', location: '' })}>Limpiar Filtros</button>
          </div>
        </div>

        <div className="panel-block">
          <h2 className="subtitle is-5 mb-0">Resultados ({filteredBranches.length})</h2>
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
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </tfoot>
              <tbody>
                {filteredBranches.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="has-text-centered">No se encontraron ramas</td>
                  </tr>
                ) : (
                  filteredBranches.map(branch => (
                    <tr key={branch.id}>
                      <th>{branch.id}</th>
                      <td>
                        <button className="button is-ghost p-0" onClick={() => handleViewBranch(branch.id)}>{branch.name}</button>
                      </td>
                      <td>{branch.location}</td>
                      <td>
                        <div className="buttons are-small">
                          <button className="button is-info" onClick={() => handleViewBranch(branch.id)}><FontAwesomeIcon icon={faEye} /></button>
                          <button className="button is-warning" onClick={() => handleEditBranch(branch.id)}><FontAwesomeIcon icon={faEdit} /></button>
                          <button className="button is-danger" onClick={() => handleDelete(branch.id)}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
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
                {modal.type === 'view' ? 'Detalles de la Rama' : modal.type === 'add' ? 'Añadir Rama' : 'Editar Rama'}
              </p>
              <button className="delete" aria-label="close" onClick={closeModal}></button>
            </header>
            <section className="modal-card-body">
              {modal.type === 'view' && modal.branch && (
                <BranchDetail branch={modal.branch} onClose={closeModal} />
              )}

              {(modal.type === 'add' || modal.type === 'edit') && (
                <BranchForm branch={modal.type === 'edit' ? modal.branch : undefined} onSubmit={handleFormSubmit} onCancel={closeModal} />
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default BranchPage;
