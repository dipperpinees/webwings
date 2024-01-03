import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Icon,
    Input,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { OAUTH_TYPE, getGitHubUrl } from "@/utils/get-github-url";
import { useSignIn } from "../..";
import { useState } from "react";

type FormValues = {
    email: string;
    password: string;
};

export function SignInForm() {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>();
    const { mutateAsync: signInHandler } = useSignIn();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
        setIsLoading(true);
        try {
            await signInHandler({ email, password });
            navigate("/app/dashboard");
        } catch (error) {
            let message = "Sign in failed";
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

    const signInWithGithub = () => {
        window.location.href = getGitHubUrl(OAUTH_TYPE["SIGNIN"], "/app/dashboard");
    };

    return (
        <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} width={{ base: "400px", sm: "90%" }}>
                <Stack align={"center"}>
                    <Heading fontSize={"3xl"}>Sign in to your account</Heading>
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
                                <Input
                                    type="password"
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
                                <FormErrorMessage mt={1}>{errors.password?.message}</FormErrorMessage>
                            </FormControl>
                            <Stack spacing={6}>
                                <Stack
                                    direction={{ base: "column", sm: "row" }}
                                    align={"start"}
                                    justify={"space-between"}
                                >
                                    <Link to="/auth/reset-password/request">
                                        <Text color={"blue.400"}>Forgot password?</Text>
                                    </Link>
                                </Stack>
                                <Button
                                    bg={"blue.400"}
                                    color={"white"}
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                    type="submit"
                                    isLoading={isLoading}
                                >
                                    Sign in
                                </Button>
                                <Flex gap={4}>
                                    <Button flex={1} onClick={signInWithGithub}>
                                        <Flex align="center" gap={3}>
                                            <Icon as={BsGithub} />
                                            <Text>GitHub</Text>
                                        </Flex>
                                    </Button>
                                    <Button flex={1}>
                                        <Flex align="center" gap={3}>
                                            <Icon as={FcGoogle} />
                                            <Text>Google</Text>
                                        </Flex>
                                    </Button>
                                </Flex>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
}
