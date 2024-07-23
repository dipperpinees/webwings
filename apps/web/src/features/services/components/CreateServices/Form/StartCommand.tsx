import { Center, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, InputProps, Text, useColorModeValue } from "@chakra-ui/react";

interface Props {
    inputProps: InputProps;
    error?: string;
}

export function StartCommand({inputProps, error}: Props) {
    return (
        <FormControl  isInvalid={!!error}>
            <Flex w="100%" align="center" gap={2}>
                <Flex direction="column" flex={1}>
                    <FormLabel m={0}>
                        <Text fontWeight={700}>Start Command</Text>
                    </FormLabel>
                    <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                    This command runs in the root directory of your app and is responsible for starting its processes.
                    </Text>
                </Flex>
                <Flex flex={2} flexDir="column">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Center color="gray.500">
                                $
                            </Center>
                        </InputLeftElement>
                        <Input py={5} prefix="$" {...inputProps}/>
                    </InputGroup>
                    <FormErrorMessage mt={1}>{error}</FormErrorMessage>
                </Flex>
            </Flex>
        </FormControl>
    );
}
