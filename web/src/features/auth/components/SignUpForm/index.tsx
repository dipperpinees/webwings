import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "../..";

type FormValues = {
    email: string;
    password: string;
};

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>();
    const { mutateAsync: signUpHandler } = useSignUp();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
        setIsLoading(true);
        try {
            await signUpHandler({ email, password });
            navigate("/app/dashboard")
        } catch (error) {
            let message = "Sign up failed";
            if (error instanceof Error) message = error.message;
            toast({
                title: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    };

    return (
        <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} width={{ base: "400px", sm: "90%" }}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Sign up
                    </Heading>
                    <Text fontSize={"lg"} color={"gray.600"}>
                        to enjoy all of our cool features ✌️
                    </Text>
                </Stack>
                <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
                            <FormControl id="email" isInvalid={!!errors.email}>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    id="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                            message: "Please enter a valid email",
                                        },
                                    })}
                                />
                                <FormErrorMessage mt={1}>{errors.email?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="password" isInvalid={!!errors.password}>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        {...register("password", {
                                            required: {
                                                value: true,
                                                message: "Password is required",
                                            },
                                            minLength: {
                                                value: 6,
                                                message: "This field has a minimum length of 6",
                                            },
                                        })}
                                    />
                                    <InputRightElement h={"full"}>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                                        >
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage mt={1}>{errors.password?.message}</FormErrorMessage>
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={"teal.400"}
                                    color={"white"}
                                    _hover={{
                                        bg: "teal.500",
                                    }}
                                    type="submit"
                                    isLoading={isLoading}
                                >
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={"center"}>
                                    Already a user?{" "}
                                    <Link href="/auth/sign-in" color={"blue.400"}>
                                        Sign In
                                    </Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
}
