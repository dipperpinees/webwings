import { Flex, FormControl, FormLabel, HStack, Input, Text, useColorModeValue } from "@chakra-ui/react";

interface Props {}

export function SelectDirectory({}: Props) {
    return (
        <FormControl>
            <Flex w="100%" align="center" gap={2}>
                <Flex direction="column" flex={1}>
                    <FormLabel m={0}>
                        <HStack>
                            <Text fontWeight={700}>Root Directory</Text>
                            <Text color="gray.500">Optional</Text>
                        </HStack>
                    </FormLabel>
                    <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                        Defaults to <strong>repository root</strong>. When you specify a root directory that is
                        different from your repository root, we run all your commands in the{" "}
                        <strong>specified directory</strong> and ignores changes outside the directory.
                    </Text>
                </Flex>
                <Flex flex={2}>
                    <Input placeholder="e.g. src" py={5} />
                </Flex>
            </Flex>
        </FormControl>
    );
}
