import { Button, Flex, FormControl, Heading, Input, Stack, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { sendRequestPasswordRequest } from "../..";

export function ForgotPasswordRequest() {
    const [email, setEmail] = useState("");
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await sendRequestPasswordRequest(email, `${window.location.origin}/auth/reset-password`);
            toast({
                title: "Send email successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: "Send email failed",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    };
    return (
        <form onSubmit={handleSubmit}>
            <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
                <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"md"}
                    bg={useColorModeValue("white", "gray.700")}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={6}
                    my={12}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
                        Forgot your password?
                    </Heading>
                    <Text fontSize={{ base: "sm", sm: "md" }} color={useColorModeValue("gray.800", "gray.400")}>
                        You&apos;ll get an email with a reset link
                    </Text>
                    <FormControl id="email">
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your-email@example.com"
                            _placeholder={{ color: "gray.500" }}
                            type="email"
                            name="email"
                            required
                        />
                    </FormControl>
                    <Stack spacing={6}>
                        <Button
                            bg={"blue.400"}
                            color={"white"}
                            _hover={{
                                bg: "blue.500",
                            }}
                            type="submit"
                            isLoading={isLoading}
                        >
                            Request Reset
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
}
