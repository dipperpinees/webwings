import { Flex, FormControl, FormLabel, Select, Text, useColorModeValue } from "@chakra-ui/react";
import { IRuntime } from "../../..";
import { useEffect } from "react";

interface Props {
    name: string;
    runtimes: IRuntime[] | undefined;
    runtime: string;
    onRuntimeChange: (runtime: string) => void;
    version: number;
    onVersionChange: (version: number) => void;
}

export function SelectRuntime({ name, runtimes = [], runtime, onRuntimeChange, version, onVersionChange }: Props) {
    useEffect(() => {
        const versionID = Number(runtimes?.find(({ name }) => name === runtime)?.versions[0].id);
        onVersionChange(versionID);
    }, [runtime])
    
    return (
        <FormControl>
            <Flex w="100%" align="center" gap={2}>
                <Flex direction="column" flex={1}>
                    <FormLabel m={0}>
                        <Text fontWeight={700}>Runtime</Text>
                    </FormLabel>
                    <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                        The runtime for your {name}.
                    </Text>
                </Flex>
                <Flex flex={2} gap={3}>
                    <Select py={5} value={runtime} onChange={(e) => onRuntimeChange(e.target.value)}>
                        {runtimes?.map(({ name }) => (
                            <option value={name} key={name}>
                                {name}
                            </option>
                        ))}
                    </Select>
                    <Select py={5} value={version} onChange={(e) => onVersionChange(Number(e.target.value))}>
                        {runtimes
                            ?.find(({ name }) => name === runtime)
                            ?.versions.map(({ id, name, runtime_name }) => (
                                <option value={id} key={runtime_name + name}>
                                    {name}
                                </option>
                            ))}
                    </Select>
                </Flex>
            </Flex>
        </FormControl>
    );
}
