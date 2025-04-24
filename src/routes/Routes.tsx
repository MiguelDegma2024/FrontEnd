import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../components/Dashboard";
import ProductPage from "../pages/ProductPage";
import ErrorPage from "../pages/ErrorPage";
import BranchPage from "../pages/BranchPage";
import UserPage from "../pages/UserPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PrivateRoute from "../components/PrivateRoute";
import SalePage from "../pages/SalePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><App /></PrivateRoute>,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "products", element: <ProductPage /> },
      { path: "branches", element: <BranchPage /> },
      { path: "users", element: <UserPage /> },
      { path: "orders", element: <SalePage /> },
      { path: "shipping", element: <div>Página de envíos</div> }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  }
]);

export default router;