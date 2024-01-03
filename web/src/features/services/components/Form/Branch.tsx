import { Flex, FormControl, FormLabel, Select, Text, useColorModeValue } from "@chakra-ui/react";
import { IBranch } from "../..";

interface Props {
    name: string;
    branches: IBranch[] | undefined
}

export function SelectBranch({name, branches = []}: Props) {
    return (
        <FormControl>
            <Flex w="100%" align="center" gap={2}>
                <Flex direction="column" flex={1}>
                    <FormLabel m={0}>
                        <Text fontWeight={700}>Branch</Text>
                    </FormLabel>
                    <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                        The repository branch used for your {name}.
                    </Text>
                </Flex>
                <Flex flex={2}>
                    <Select py={5}>
                        {branches?.map((branch) => (
                            <option value={branch.name} key={branch.name}>
                                {branch.name}
                            </option>
                        ))}
                    </Select>
                </Flex>
            </Flex>
        </FormControl>
    );
}
