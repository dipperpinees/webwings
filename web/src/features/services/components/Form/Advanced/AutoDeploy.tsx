import { Flex, FormLabel, Select, Text, useColorModeValue } from "@chakra-ui/react";

export function AutoDeploy() {
    return (
        <Flex w="100%" align="center" gap={2}>
            <Flex direction="column" flex={1}>
                <FormLabel m={0}>
                    <Text fontWeight={700}>Auto Deploy</Text>
                </FormLabel>
                <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                    Automatic deploy on every push to your repository or changes to your service? Select "No" to handle
                    your deploys manually.
                </Text>
            </Flex>
            <Flex flex={2}>
                <Select>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </Select>
            </Flex>
        </Flex>
    );
}
