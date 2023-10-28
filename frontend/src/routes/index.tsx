import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './public';
import useAuth from '@/features/auth/api/useAuth';
import { protectedRoute } from './protected';
import { Progress } from '@chakra-ui/react';

export const AppRoutes = () => {
    const {isSuccess, isLoading} = useAuth();
    if (isLoading) return <Progress size='xs' isIndeterminate colorScheme='teal'/>;

    const routes = createBrowserRouter([...publicRoutes, ...isSuccess ? protectedRoute: []]);

    return <RouterProvider router={routes} />;
};