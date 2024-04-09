import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import theme from "@/utils/theme";
import WSProvider from "./ws";

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
    const queryClient = new QueryClient();
    return (<ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
            <WSProvider>
                {children}
            </WSProvider>
        </QueryClientProvider>
    </ChakraProvider>)
}