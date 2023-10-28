import useAuth from '@/features/auth/api/useAuth';
import { getGitHubUrl } from '@/utils/getGithubUrl';
import { Avatar, Box, Button, Container, Flex, Heading, Icon, Progress, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsFillPlusCircleFill, BsGithub } from 'react-icons/bs';
import { FcOk } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import useOAuth from '../../api/useOAuth';
import RepositoriesList from '../RepositoriesList';
import { GithubRepo } from '../../types/Repositories';

interface ISelectRepositoriesProps {
    setSelectedRepo: (repo: GithubRepo) => void
}

export default function SelectRepositories({setSelectedRepo}: ISelectRepositoriesProps) {
    const { data: user } = useAuth();
    const { data: oauthData, refetch: refetchOAuth, isLoading: isOAuthLoading } = useOAuth();

    useEffect(() => {
        window.addEventListener('message', (event: MessageEvent<string>) => {
            if (event.data === 'oauth-successfully') refetchOAuth();
        });
    }, []);

    const handleGithubOAuth = () => {
        if (!user) return;
        const githubOAuthUrl = getGitHubUrl(user.id);
        window.open(githubOAuthUrl, '_blank', 'width=500,height=500');
    };

    if (isOAuthLoading)
        return (
            <Progress
                size="xs"
                isIndeterminate
                colorScheme="teal"
            />
        );

    return (
        <Container maxW="container.xl">
            <Text
                fontSize="2xl"
                mt={4}
                mb={8}
            >
                Create a new <strong>Web Services</strong>
            </Text>
            <Flex gap={8}>
                <Flex
                    gap={3}
                    direction="column"
                    flex={2}
                    border="1px solid #aed4c6"
                    borderRadius={4}
                    height="400px"
                    p={5}
                >
                    <Heading
                        as="h4"
                        size="sm"
                    >
                        Connect a repository
                    </Heading>
                    {oauthData ? (
                        <RepositoriesList setSelectedRepo={setSelectedRepo}/>
                    ) : (
                        <Flex
                            border="1px solid #aed4c6"
                            borderRadius={4}
                            flex={1}
                            align="center"
                            justify="center"
                            overflow="auto"
                        >
                            <Button
                                leftIcon={<Icon as={BsGithub} />}
                                size="lg"
                                colorScheme="blue"
                                onClick={handleGithubOAuth}
                            >
                                Connect GitHub
                            </Button>
                        </Flex>
                    )}
                </Flex>
                <Box flex={1}>
                    <Flex
                        align="center"
                        gap={2}
                    >
                        <Icon
                            as={BsGithub}
                            fontSize="xl"
                        />
                        <Text
                            fontSize="xl"
                            as="b"
                        >
                            Github
                        </Text>
                    </Flex>
                    {oauthData ? (
                        <Link
                            to={oauthData?.[0]?.url}
                            target="_blank"
                        >
                            <Flex
                                align="center"
                                gap={1}
                            >
                                <Icon as={FcOk} />
                                <Avatar
                                    size="xs"
                                    src={oauthData?.[0].avatarUrl}
                                />
                                <Text fontSize="sm">@{oauthData?.[0].username}</Text>
                                <Icon as={BiLinkExternal} />
                            </Flex>
                        </Link>
                    ) : (
                        <Button
                            colorScheme="purple"
                            variant="ghost"
                            onClick={handleGithubOAuth}
                        >
                            <Flex
                                my={4}
                                align="center"
                                gap={1}
                            >
                                <Icon as={BsFillPlusCircleFill} />
                                <Text fontSize="sm">Connect account</Text>
                            </Flex>
                        </Button>
                    )}
                </Box>
            </Flex>
        </Container>
    );
}
