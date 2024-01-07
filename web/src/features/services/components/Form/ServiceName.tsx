import {
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputProps,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";

interface Props {
    name: string;
    inputProps: InputProps;
    error?: string;
}

export function ServiceName({ name, inputProps, error = "" }: Props) {
    return (
        <FormControl isInvalid={!!error}>
            <Flex w="100%" align="center" gap={2}>
                <Flex direction="column" flex={1}>
                    <FormLabel m={0}>
                        <Text fontWeight={700}>Name</Text>
                    </FormLabel>
                    <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                        A unique name for your {name}.
                    </Text>
                </Flex>
                <Flex direction="column" flex={2}>
                    <Input placeholder="example-service-name" py={5} {...inputProps} />
                    <FormErrorMessage mt={1}>{error}</FormErrorMessage>
                </Flex>
            </Flex>
        </FormControl>
    );
}
