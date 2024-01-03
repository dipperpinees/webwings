import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./utils/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
    </>,
);
