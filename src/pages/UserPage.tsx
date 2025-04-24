import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faEye, faUser, faEnvelope, faUserTag, faFilter } from "@fortawesome/free-solid-svg-icons";
import { User } from "my-types";
import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, getUserById, createUser, updateUser } from "../Api/UserAPI";
import UserForm from "../components/UserForm";
import UserDetail from "../components/UserDetail";

interface Props {}

type ModalContent = {
  type: 'none' | 'view' | 'add' | 'edit';
  user?: User;
}

const UserPage = (_props: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [modal, setModal] = useState<ModalContent>({ type: 'none' });
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filter, setFilter] = useState({
    name: '',
    email: '',
    role: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      if (data && Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Los datos recibidos no son un array:", data);
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!users || users.length === 0) {
      setFilteredUsers([]);
      return;
    }

    let result = [...users];
    if (filter.name) {
      result = result.filter(u => u.name.toLowerCase().includes(filter.name.toLowerCase()));
    }
    if (filter.email) {
      result = result.filter(u => u.email.toLowerCase().includes(filter.email.toLowerCase()));
    }
    if (filter.role) {
      result = result.filter(u => u.role === filter.role);
    }

    setFilteredUsers(result);
  }, [filter, users]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilter({ name: '', email: '', role: '' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        alert("Usuario eliminado con éxito");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error al eliminar el usuario");
      }
    }
  };

  const handleViewUser = async (id: number) => {
    try {
      const user = await getUserById(id);
      if (user) {
        setModal({ type: 'view', user });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error al obtener detalles del usuario");
    }
  };

  const handleEditUser = async (id: number) => {
    try {
      const user = await getUserById(id);
      if (user) {
        setModal({ type: 'edit', user });
      }
    } catch (error) {
      console.error("Error fetching user for edit:", error);
      alert("Error al obtener el usuario para editar");
    }
  };

  const handleAddUser = () => {
    setModal({ type: 'add' });
  };

  const closeModal = () => {
    setModal({ type: 'none' });
  };

  const handleFormSubmit = async (userData: Omit<User, 'id'>) => {
    try {
      if (modal.type === 'add') {
        await createUser(userData);
        alert("Usuario creado con éxito");
      } else if (modal.type === 'edit' && modal.user) {
        await updateUser(modal.user.id, userData);
        alert("Usuario actualizado con éxito");
      }
      closeModal();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error saving user:", error);
      alert(`Error al ${modal.type === 'add' ? 'crear' : 'actualizar'} el usuario`);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch(role.toLowerCase()) {
      case 'admin':
        return 'tag is-warning';
      case 'user':
        return 'tag is-info';
      default:
        return 'tag is-light';
    }
  };

  return (
    <div className="fade-in">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon-background has-background-success mr-3">
              <FontAwesomeIcon icon={faUser} size="lg" className="has-text-white" />
            </span>
            Gestión de Usuarios
          </p>
        </header>
        
        <div className="card-content">
          <div className="columns">
            <div className="column">
              <button 
                className="button is-primary is-fullwidth"
                onClick={handleAddUser}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>Añadir Nuevo Usuario</span>
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
              <h2 className="subtitle is-5 mb-3">Filtrar Usuarios</h2>
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
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="email"
                        value={filter.email}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por email"
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="field">
                    <label className="label">Rol</label>
                    <div className="control has-icons-left">
                      <div className="select is-fullwidth">
                        <select 
                          name="role"
                          value={filter.role}
                          onChange={handleFilterChange}
                        >
                          <option value="">Todos los roles</option>
                          <option value="admin">Administrador</option>
                          <option value="user">Usuario</option>
                        </select>
                      </div>
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faUserTag} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="buttons mt-3">
                <button 
                  className="button is-info"
                  onClick={() => setFilteredUsers(users)}
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
          )}

          <div className="notification is-light is-info is-flex is-justify-content-space-between">
            <span>Total de usuarios: <strong>{filteredUsers.length || 0}</strong></span>
            {(filter.name || filter.email || filter.role) ? (
              <span>
                Filtrando por: 
                {filter.name ? ` Nombre: "${filter.name}"` : ''} 
                {filter.name && (filter.email || filter.role) ? ' y ' : ''} 
                {filter.email ? ` Email: "${filter.email}"` : ''}
                {(filter.name || filter.email) && filter.role ? ' y ' : ''} 
                {filter.role ? ` Rol: "${filter.role}"` : ''}
              </span>
            ) : (
              <span>Mostrando todos los usuarios</span>
            )}
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
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {!filteredUsers || filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="has-text-centered py-5">
                        <p className="has-text-grey">No se encontraron usuarios</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <th>{user.id}</th>
                        <td>
                          <button 
                            className="button is-ghost p-0 has-text-success-dark"
                            onClick={() => handleViewUser(user.id)}
                          >
                            {user.name}
                          </button>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={getRoleBadgeClass(user.role)}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="buttons are-small">
                            <button
                              className="button is-info is-rounded"
                              onClick={() => handleViewUser(user.id)}
                              title="Ver detalles"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                              className="button is-warning is-rounded"
                              onClick={() => handleEditUser(user.id)}
                              title="Editar usuario"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="button is-danger is-rounded"
                              onClick={() => handleDelete(user.id)}
                              title="Eliminar usuario"
                            >
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
                {modal.type === 'view' ? 'Detalles del Usuario' :
                modal.type === 'add' ? 'Añadir Usuario' : 'Editar Usuario'}
                </p>
                <button 
                  className="delete" 
                  aria-label="close"
                  onClick={closeModal}
                ></button>
              </header>
              <section className="modal-card-body">
                {modal.type === 'view' && modal.user && (
                  <UserDetail 
                    user={modal.user} 
                    onClose={closeModal} 
                  />
                )}
  
                {(modal.type === 'add' || modal.type === 'edit') && (
                  <UserForm
                    user={modal.type === 'edit' ? modal.user : undefined}
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
  
  export default UserPage;