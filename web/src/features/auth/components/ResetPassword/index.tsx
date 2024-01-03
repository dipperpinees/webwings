import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { resetPassword } from "../..";
import { useNavigate, useSearchParams } from "react-router-dom";

type FormValues = {
    password: string;
    confirmPassword: string;
};

export function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<FormValues>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    if (!searchParams.get("user") || !searchParams.get("code")) return null;

    const onSubmit: SubmitHandler<FormValues> = async ({password}) => {
        setIsLoading(true);
        const userID = searchParams.get("user");
        const code = searchParams.get("code");
        if (!userID || !code) return;
        try {
            await resetPassword({user: userID, code, password});
            toast({
                title: "Reset password successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setTimeout(() => {
                navigate("/auth/sign-in")
            }, 2000)
        } catch (err) {
            toast({
                title: "Reset password failed",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                        Reset your password
                    </Heading>
                    <FormControl id="email" isInvalid={!!errors.password}>
                        <FormLabel>New password</FormLabel>
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
                    <FormControl id="email" isInvalid={!!errors.confirmPassword}>
                        <FormLabel>Confirm password</FormLabel>
                        <Input
                            type="password"
                            {...register("confirmPassword", {
                                validate: (value) => {
                                    if (value !== watch("password")) return "Your passwords does not match";
                                },
                            })}
                        />
                        <FormErrorMessage mt={1}>{errors.confirmPassword?.message}</FormErrorMessage>
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
                            Reset password
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
}
