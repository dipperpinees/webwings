import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: true,
};

const theme = extendTheme({
    config,
    fonts: {
        heading: "Poppins",
        body: "Poppins",
    },
    colors: {
        beauty: "rgb(90, 90, 130)",
    }
});

export default theme;
