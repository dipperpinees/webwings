import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import { AutoDeploy } from "./AutoDeploy";
import { EnvironmentVariable } from "./Environment";
import { ToggleAdvanced } from "./ToggleAdvanced";

interface IAdvancedConfigProps {
    showEnvConfig?: boolean
}

export function AdvancedConfig({showEnvConfig = true}: IAdvancedConfigProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <VStack align="flex-start" gap={6}>
            <ToggleAdvanced isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <VStack
                    gap={10}
                    align="flex-start"
                    width="100%"
                    borderWidth={1}
                    borderRadius={6}
                    borderColor="gray.400"
                    py={4}
                    px={5}
                >
                    {showEnvConfig && <EnvironmentVariable />}
                    <AutoDeploy />
                </VStack>
            )}
        </VStack>
    );
}
