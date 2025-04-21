
import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import ProductPage from "../pages/ProductPage";

import ErrorPage from "../pages/ErrorPage";

import BranchPage from "../pages/BranchPage";
import UserPage from "../pages/UserPage";


const router = createBrowserRouter([

{

path: "/",

element: <App />,

errorElement: <ErrorPage />

}

,

{

path: "/products",

element: <ProductPage />,

errorElement: <ErrorPage />,

},
{
    path: "/branches",
    element: <BranchPage />,
    errorElement: <ErrorPage />,
},
{
    path: "/users",
    element: <UserPage />,
    errorElement: <ErrorPage />,
},
]);


export default router;