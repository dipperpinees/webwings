import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Icon, useColorMode } from "@chakra-ui/react";

export function SwitchColorMode() {
    const { colorMode, toggleColorMode } = useColorMode()
    return <Button bgColor="transparent" onClick={toggleColorMode}>
        <Icon as={colorMode === "light" ? MoonIcon : SunIcon} color="gray.500"/>
    </Button>
}