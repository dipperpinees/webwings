import { Button, HStack, Icon, Input, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";

export function EnvironmentVariable() {
    return (
        <VStack align="flex-start" gap={3}>
            <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                Use environment variables to store API keys and other configuration values and secrets.{" "}
            </Text>
            <VStack align="flex-start">
                <HStack align="flex-start" gap={4}>
                    <Input placeholder="key" fontSize="sm" />
                    <Input placeholder="value" />
                    <Button variant="outline">
                        <Icon color={useColorModeValue("beauty", "white")} as={AiOutlineDelete} />
                    </Button>
                </HStack>
            </VStack>
            <Button color={useColorModeValue("beauty", "white")} variant="outline" fontSize="sm">Add Variables</Button>
        </VStack>
    );
}
