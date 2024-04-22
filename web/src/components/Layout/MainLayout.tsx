import { useAuth, useLogout } from "@/features/auth";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { MdAdd, MdLogout, MdSettings } from "react-icons/md";
import { PiComputerTowerBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "..";
import { SwitchColorMode } from "../SwitchColorMode";
import Footer from "./Footer";

interface Props {
    children: React.ReactNode;
}

const Links = ["Dashboard"];

const NavLink = (props: Props) => {
    const { children } = props;
    return (
        <Box
            as="a"
            px={2}
            py={1}
            rounded={"md"}
            _hover={{
                textDecoration: "none",
                bg: useColorModeValue("gray.200", "gray.700"),
            }}
            href={"#"}
        >
            {children}
        </Box>
    );
};

type MainLayoutProps = {
    children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
    const { data } = useAuth();
    const { mutateAsync: signOutHandler } = useLogout();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const nagivate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOutHandler();
            nagivate("/");
        } catch (error) {
            let message = "Sign out failed";
            if (error instanceof Error) message = error.message;
            toast({
                title: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bgColor={useColorModeValue("white", "#1A202C")}
                px={4}
                borderBottom="0.5px solid var(--chakra-colors-chakra-border-color)"
                zIndex={100000}
            >
                <Flex h={14} alignItems={"center"} justifyContent={"space-between"}>
                    <IconButton
                        size={"md"}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={"center"}>
                        <Box>
                            <Logo redirect="/app/dashboard" />
                        </Box>
                        <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>

                    <Flex alignItems={"center"} gap={2}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={"full"}
                                variant={"link"}
                                cursor={"pointer"}
                                display={"flex"}
                                minW={0}
                            >
                                <Button colorScheme="teal">
                                    <HStack>
                                        <Icon as={MdAdd} fontSize={20} />
                                        <Text>New</Text>
                                    </HStack>
                                </Button>
                            </MenuButton>
                            <MenuList>
                                {/* <Link to="/app/select-repo/static">
                                    <MenuItem icon={<Icon as={MdWebAsset} />}>Static Site</MenuItem>
                                </Link> */}
                                <Link to="/app/select-repo/web">
                                    <MenuItem icon={<Icon as={PiComputerTowerBold} />}>Web Service</MenuItem>
                                </Link>
                            </MenuList>
                        </Menu>
                        <SwitchColorMode />
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={"full"}
                                variant={"link"}
                                cursor={"pointer"}
                                display={"flex"}
                                minW={0}
                            >
                                <Flex align={"center"} gap={2}>
                                    <Text>{data?.name}</Text>
                                    <Avatar size={"sm"} icon={<AiOutlineUser fontSize="1.5rem" />} />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                <Link to={`/app/user/${data?.id}/settings`}>
                                    <MenuItem icon={<Icon as={MdSettings} />}>Account Settings</MenuItem>
                                </Link>
                                <MenuDivider />
                                <MenuItem onClick={handleSignOut} icon={<Icon as={MdLogout} />}>
                                    Sign out
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: "none" }}>
                        <Stack as={"nav"} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>

            <Box paddingTop="64px" minHeight="calc(100vh - 72px);">{children}</Box>
            <Footer />
        </>
    );
}
