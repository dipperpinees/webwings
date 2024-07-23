import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import theme from "@/utils/theme";
import WSProvider from "./ws";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from "@/configs";

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
    const queryClient = new QueryClient();
    return (<ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <WSProvider>
                    {children}
                </WSProvider>
            </GoogleOAuthProvider>
        </QueryClientProvider>
    </ChakraProvider>)
}