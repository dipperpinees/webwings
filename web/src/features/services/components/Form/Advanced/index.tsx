import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import { AutoDeploy } from "./AutoDeploy";
import { EnvironmentVariable } from "./Environment";
import { ToggleAdvanced } from "./ToggleAdvanced";
import { UseFormRegister } from "react-hook-form";
import { IDeployment } from "@/features/services";

interface IAdvancedConfigProps {
    showEnvConfig?: boolean;
    register: UseFormRegister<IDeployment>;
}

export function AdvancedConfig({showEnvConfig = true, register}: IAdvancedConfigProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <VStack align="flex-start" gap={6}>
            <ToggleAdvanced isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
                <VStack
                    gap={10}
                    align="flex-start"
                    width="100%"
                    borderWidth={1}
                    borderRadius={6}
                    borderColor="gray.400"
                    py={4}
                    px={5}
                    display={isOpen ? "inherit" : "none"}
                >
                    {showEnvConfig && <EnvironmentVariable />}
                    <AutoDeploy selectProps={{...register("auto_deploy")}}/>
                </VStack>
        </VStack>
    );
}
