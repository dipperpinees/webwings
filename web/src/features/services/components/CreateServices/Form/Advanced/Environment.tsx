import { IEnvironment } from "@/features/services";
import { useEnvStore } from "@/stores/env";
import { AddIcon } from "@chakra-ui/icons";
import { Button, HStack, Icon, Input, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";

export function EnvironmentVariable() {
    const env = useEnvStore((state) => state.env);
    const setEnv = useEnvStore((state) => state.updateEnv);

    const addNewEnv = () => {
        setEnv([...env, { key: "", value: "" }]);
    };

    const changeEnv = (index: number, type: keyof IEnvironment, value: string) => {
        env[index][type] = value;
        setEnv([...env]);
    };

    const deleteEnv = (index: number) => {
        setEnv(env.filter((_, _index) => index !== _index));
    }

    return (
        <VStack align="flex-start" gap={3}>
            <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                Use environment variables to store API keys and other configuration values and secrets.{" "}
            </Text>
            <VStack align="flex-start">
                {env.map(({ key, value }, index) => (
                    <HStack key={index} align="flex-start" gap={4}>
                        <Input
                            placeholder="key"
                            fontSize="sm"
                            value={key}
                            onChange={(e) => changeEnv(index, "key", e.target.value)}
                        />
                        <Input
                            placeholder="value"
                            value={value}
                            onChange={(e) => changeEnv(index, "value", e.target.value)}
                        />
                        <Button variant="outline" onClick={() => deleteEnv(index)}>
                            <Icon color={useColorModeValue("beauty", "white")} as={AiOutlineDelete} />
                        </Button>
                    </HStack>
                ))}
            </VStack>
            <HStack>
                <Button
                    onClick={addNewEnv}
                    color={useColorModeValue("beauty", "white")}
                    variant="outline"
                    fontSize="sm"
                    leftIcon={<AddIcon />}
                >
                    Add Variables
                </Button>
                {/* <Button
                    onClick={addNewEnv}
                    color={useColorModeValue("beauty", "white")}
                    variant="outline"
                    fontSize="sm"
                    leftIcon={<CgFileDocument />}
                >
                    Add from .env
                </Button> */}
            </HStack>
        </VStack>
    );
}
