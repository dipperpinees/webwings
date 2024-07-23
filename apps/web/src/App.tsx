import { AppProvider } from "@/providers/app";
import { AppRoutes } from "@/routes";
import { ColorModeProvider } from "@chakra-ui/react";
import "@fontsource/inter";

function App() {
    return (
        <AppProvider>
            <ColorModeProvider>
                <AppRoutes />
            </ColorModeProvider>
        </AppProvider>
    );
}

export default App;
