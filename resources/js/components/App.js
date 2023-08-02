import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import DashboardAddProduct from "./pages/dashboard/DashboardAddProduct";
import DashboardProductIndex from "./pages/dashboard/DashboardProductIndex";
import DashboardEditProduct from "./pages/dashboard/DashboardEditProduct";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
    const router = createBrowserRouter([
        {
            path: "/home",
            element: <Home />,
        },
        {
            path: "/admin",
            element: <DashboardIndex />,
        },
        {
            path: "/admin/products",
            element: <DashboardProductIndex />,
        },
        {
            path: "/admin/products/add",
            element: <DashboardAddProduct />,
        },
        {
            path: "/admin/products/edit/:product",
            element: <DashboardEditProduct />,
        },
        {
            path: "/products",
            element: <ProductDetailPage />
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
    ]);
    return (
        <RouterProvider router={router} />
    );
}

export default App;

if (document.getElementById("app")) {
    ReactDOM.render(<App />, document.getElementById("app"));
}
