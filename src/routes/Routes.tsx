
import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import ProductPage from "../pages/ProductPage";

import ErrorPage from "../pages/ErrorPage";


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

}

]);


export default router;