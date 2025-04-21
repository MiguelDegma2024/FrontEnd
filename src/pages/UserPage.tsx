import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus , faEye} from "@fortawesome/free-solid-svg-icons";
import { User } from "my-types"; // Asegúrate de importar el tipo User
import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, getUserById, createUser, updateUser } from "../Api/UserAPI"; // Asegúrate de tener estos métodos
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
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
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

  return (
    <>
      <nav className="panel">
        <p className="panel-heading">Todos los Usuarios</p>
        
        <div className="panel-block">
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

        <div className="panel-block">
          <h2 className="subtitle is-5 mb-0">Filtrar Usuarios</h2>
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
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="email"
                  value={filter.email}
                  onChange={handleFilterChange}
                  placeholder="Filtrar por email"
                />
              </div>
            </div>

            <div className="field is-flex-grow-1 mx-1">
              <label className="label">Rol</label>
              <div className="control">
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
              </div>
            </div>
          </div>
        </div>

        <div className="panel-block">
          <div className="buttons">
            <button 
              className="button is-link"
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

        <div className="panel-block">
          <h2 className="subtitle is-5 mb-0">
            Resultados ({filteredUsers.length || 0})
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
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </tfoot>
              <tbody>
                {!filteredUsers || filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="has-text-centered">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <th>{user.id}</th>
                      <td>
                        <button 
                          className="button is-ghost p-0"
                          onClick={() => handleViewUser(user.id)}
                        >
                          {user.name}
                        </button>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <div className="buttons are-small">

                        <button
                          className="button is-info"
                          onClick={() => handleViewUser(user.id)}
                          title="Ver detalles"
                        >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            className="button is-warning"
                            onClick={() => handleEditUser(user.id)}
                            title="Editar usuario"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="button is-danger"
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
          )}
        </div>
      </nav>

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
    </>
  );
};

export default UserPage;
