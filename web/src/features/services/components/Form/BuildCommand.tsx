import { Center, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Text, useColorModeValue } from "@chakra-ui/react";

export function BuildCommand() {
    return (
        <FormControl>
            <Flex w="100%" align="center" gap={2}>
                <Flex direction="column" flex={1}>
                    <FormLabel m={0}>
                        <Text fontWeight={700}>Build Command</Text>
                    </FormLabel>
                    <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                        This command runs in the root directory of your repository when a new version of your code is
                        pushed, or when you deploy manually.
                    </Text>
                </Flex>
                <Flex flex={2}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Center color="gray.500">
                                $
                            </Center>
                        </InputLeftElement>
                        <Input py={5} prefix="$" />
                    </InputGroup>
                </Flex>
            </Flex>
        </FormControl>
    );
}
