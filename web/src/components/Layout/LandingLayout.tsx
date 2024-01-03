import { Box, Button, Flex, HStack, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { Logo } from "..";

type LandingLayoutProps = {
    children: React.ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
    const { data: user } = useAuth();

    return (
        <>
            <Box position="fixed" top={0} left={0} right={0} bg={useColorModeValue("gray.100", "gray.900")} px={4}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack spacing={8} alignItems={"center"}>
                        <Box>
                            <Logo />
                        </Box>
                    </HStack>
                    <Flex alignItems={"center"}>
                        {user ? (
                            <Link to="/app/dashboard">
                                <Button colorScheme="blue" borderRadius={50}>
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Flex gap={4}>
                                <Link to="/auth/sign-up">
                                    <Button>Sign Up</Button>
                                </Link>
                                <Link to="/auth/sign-in">
                                    <Button colorScheme="blue">Sign In</Button>
                                </Link>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Box>

            {children}
        </>
    );
}
