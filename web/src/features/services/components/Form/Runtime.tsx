import { Flex, FormControl, FormLabel, Select, Text, useColorModeValue } from "@chakra-ui/react";
import { IRuntime } from "../..";

interface Props {
    name: string;
    runtimes: IRuntime[] | undefined;
    value: string;
    onChange: (value: string) => void;
}

export function SelectRuntime({name, runtimes = [], value, onChange}: Props) {
    return (
        <FormControl>
            <Flex w="100%" align="center" gap={2}>
                <Flex direction="column" flex={1}>
                    <FormLabel m={0}>
                        <Text fontWeight={700}>Runtime</Text>
                    </FormLabel>
                    <Text color={useColorModeValue("beauty", "white")} fontSize="sm">The runtime for your {name}.</Text>
                </Flex>
                <Flex flex={2} gap={3}>
                    <Select
                        py={5}
                        placeholder="Select runtime"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        {runtimes?.map(({ name }) => (
                            <option value={name} key={name}>
                                {name}
                            </option>
                        ))}
                    </Select>
                    <Select py={5} placeholder="Select runtime version">
                        {runtimes
                            ?.find(({ name }) => name === value)
                            ?.versions.map(({ name, runtime_name }) => (
                                <option value={name} key={runtime_name + name}>
                                    {name}
                                </option>
                            ))}
                    </Select>
                </Flex>
            </Flex>
        </FormControl>
    );
}
