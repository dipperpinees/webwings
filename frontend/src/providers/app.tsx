import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

type AppProviderProps = {
    children: React.ReactNode;
};
  
export const AppProvider = ({ children }: AppProviderProps) => {
    const queryClient = new QueryClient();
    return (<ChakraProvider>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </ChakraProvider>)
}