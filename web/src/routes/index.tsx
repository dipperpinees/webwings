import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { protectedRoute } from "./protected";
import { publicRoutes } from "./public";

export const AppRoutes = () => {

    const routes = createBrowserRouter([...publicRoutes, ...protectedRoute]);

    return <RouterProvider router={routes} />;
};
