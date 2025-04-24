import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBoxOpen,
  faStore,
  faUsers,
  faShoppingCart,
  faTruck,
  faUserCircle,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { getCurrentUser, logout } from "./Api/AuthAPI";
import { User } from "my-types";

const App: React.FC = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Cargar usuario actual del localStorage al iniciar
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  
  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    const currentPath = location.pathname === "/" ? "/dashboard" : location.pathname;
    return currentPath === path ? "has-text-primary has-text-weight-bold" : "";
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    // Redirigir al login
    window.location.href = "/login";
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="menu sidebar">
        <div className="sidebar-header">
          <p className="menu-label">NeoPharma</p>
        </div>
        <ul className="menu-list">
          <li>
            <Link to="/dashboard" className={isActive("/dashboard")}>
              <FontAwesomeIcon icon={faHome} className="mr-2" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive("/products")}>
              <FontAwesomeIcon icon={faBoxOpen} className="mr-2" /> Productos
            </Link>
          </li>
          <li>
            <Link to="/branches" className={isActive("/branches")}>
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
              <p className="has-text-weight-bold">{currentUser?.name || 'Usuario'}</p>
              <p className="is-size-7">{currentUser?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="button is-small is-danger is-light mt-2">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default App;