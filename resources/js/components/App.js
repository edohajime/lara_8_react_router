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
import DashboardAddWarehouseIOs from "./pages/dashboard/DashboardAddWarehouseIOs";
import DashboardEditWarehouseIOs from "./pages/dashboard/DashboardEditWarehouseIOs";
import DashboardAddWarehouse from "./pages/dashboard/DashboardAddWarehouse";
import DashboardEditWarehouse from "./pages/dashboard/DashboardEditWarehouse";
import DashboardAddWarehousesInventory from "./pages/dashboard/DashboardAddWarehousesInventory";
import DashboardEditWarehousesInventory from "./pages/dashboard/DashboardEditWarehousesInventory";
import DashboardSKUProduct from "./pages/dashboard/DashboardSKUProduct";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
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
            path: "/admin/products/edit",
            element: <DashboardEditProduct />,
        },
        {
            path: "/admin/products/skus",
            element: <DashboardSKUProduct />,
        },
        {
            path: "/admin/warehouses/io",
            element: <DashboardAddWarehouseIOs />,
        },
        {
            path: "/admin/warehouses/io/edit",
            element: <DashboardEditWarehouseIOs />,
        },
        {
            path: "/admin/warehouses",
            element: <DashboardAddWarehouse />,
        },
        {
            path: "/admin/warehouses/edit",
            element: <DashboardEditWarehouse />,
        },
        {
            path: "/admin/warehouses/inventory",
            element: <DashboardAddWarehousesInventory />,
        },
        {
            path: "/admin/warehouses/inventory/edit",
            element: <DashboardEditWarehousesInventory />,
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
