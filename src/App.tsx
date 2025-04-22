import { Outlet } from "react-router";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBoxOpen,
  faStore,
  faUsers,
  faShoppingCart,
  faTruck,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard"; // Import the Dashboard component

interface Props {}

const App = (_props: Props) => {
  const location = useLocation();
  
  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    return location.pathname === path ? "has-text-primary has-text-weight-bold" : "";
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="menu sidebar">
        <div className="sidebar-header">
          <p className="menu-label">Mi Tienda</p>
        </div>
        <ul className="menu-list">
          <li>
            <Link to="/" className={isActive("/")}>
              <FontAwesomeIcon icon={faHome} className="mr-2" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive("/products")}>
              <FontAwesomeIcon icon={faBoxOpen} className="mr-2" /> Productos
            </Link>
          </li>
          <li>
            <Link to="/branches" className={isActive("/stores")}>
              <FontAwesomeIcon icon={faStore} className="mr-2" /> Sucursales
            </Link>
          </li>
          <li>
            <Link to="/users" className={isActive("/users")}>
              <FontAwesomeIcon icon={faUsers} className="mr-2" /> Usuarios
            </Link>
          </li>
          <li>
            <Link to="/orders" className={isActive("/orders")}>
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> Ventas
            </Link>
          </li>
          <li>
            <Link to="/shipping" className={isActive("/shipping")}>
              <FontAwesomeIcon icon={faTruck} className="mr-2" /> Envíos
            </Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="user-profile">
            <FontAwesomeIcon icon={faUserCircle} size="2x" className="mr-2" />
            <div>
              <p className="has-text-weight-bold">Usuario</p>
              <p className="is-size-7">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add other routes here */}
          <Route path="*" element={<Outlet />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;