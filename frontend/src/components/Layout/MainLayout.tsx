import useAuth from '@/features/auth/api/useAuth'
import useLogout from '@/features/auth/api/useLogout'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react'
import {AiOutlineUser} from "react-icons/ai"

interface Props {
    children: React.ReactNode
}

const Links = ['Dashboard', 'Projects', 'Team']

const NavLink = (props: Props) => {
    const { children } = props

    return (
        <Box
            as="a"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
            href={'#'}>
            {children}
        </Box>
    )
}

type MainLayoutProps = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    const {data} = useAuth();
    const logout = useLogout();
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>Logo</Box>
                        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                display={'flex'}
                                minW={0}>
                                <Flex align={'center'} gap={2}>
                                    <Text>{data?.name}</Text>
                                    <Avatar
                                        size={'sm'}
                                        icon={<AiOutlineUser fontSize='1.5rem' />}
                                    />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Link 1</MenuItem>
                                <MenuDivider />
                                <MenuItem>Sign out</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>

            {children}
        </>
    )
}