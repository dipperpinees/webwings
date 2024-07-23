import { AuthRoutes } from "@/features/auth";
import { LandingRoutes } from "@/features/landing";

export const publicRoutes = [
    {
        path: '/',
        element: <LandingRoutes />,
    },
    {
        path: '/auth/*',
        element: <AuthRoutes />,
    },
];