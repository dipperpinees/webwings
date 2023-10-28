import MainLayout from "@/components/Layout/MainLayout";
import { DashboardRoutes } from "@/features/dashboard";
import { WebServicesRoutes } from "@/features/web-services";
import { Progress } from "@chakra-ui/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const App = () => {
    return (
        <MainLayout>
            <Suspense
                fallback={
                    <Progress size='xs' isIndeterminate colorScheme='teal'/>
                }
            >
                <Outlet />
            </Suspense>
        </MainLayout>
    );
};

export const protectedRoute = [
    {
        path: '/app',
        element: <App />,
        children: [
            { path: '/app/dashboard/*', element: <DashboardRoutes /> },
            { path: '/app/web-services/*', element: <WebServicesRoutes /> },
        ],
    },
];