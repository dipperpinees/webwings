import { MainLayout } from "@/components";
import { useAuth } from "@/features/auth";
import { DashboardRoutes } from "@/features/dashboard";
import { SelectRepoRoutes } from "@/features/select-repo";
import { ServicesRoutes } from "@/features/services";
import { UserRoutes } from "@/features/user";
import { Progress } from "@chakra-ui/react";
import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const App = () => {
    const { data: user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;
        if (!user) navigate("/");
    }, [isLoading, navigate, user]);

    if (isLoading) return <Progress size="xs" isIndeterminate colorScheme="teal" />;

    return (
        <MainLayout>
            <Suspense fallback={<Progress size="xs" isIndeterminate colorScheme="teal" />}>
                <Outlet />
            </Suspense>
        </MainLayout>
    );
};

export const protectedRoute = [
    {
        path: "/app",
        element: <App />,
        children: [
            { path: "/app/dashboard/*", element: <DashboardRoutes /> },
            { path: "/app/select-repo/*", element: <SelectRepoRoutes /> },
            { path: "/app/services/*", element: <ServicesRoutes /> },
            { path: "/app/user/*", element: <UserRoutes /> },
            { path: '/app/*', element: <Navigate to="/app/dashboard" /> },
        ],
    },
];
