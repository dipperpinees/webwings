import { TitleLayout } from "@/components";
import { useAuth } from "@/features/auth";
import { useSelectedRepo } from "@/stores";
import { OAUTH_TYPE, getGitHubUrl } from "@/utils/get-github-url";
import { Avatar, Box, Button, Flex, Heading, Icon, Progress, Text } from "@chakra-ui/react";
import { BiLinkExternal } from "react-icons/bi";
import { BsFillPlusCircleFill, BsGithub } from "react-icons/bs";
import { FcOk } from "react-icons/fc";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ESelectRepo, IGithubRepo } from "..";
import {useOAuth} from "../api";
import { RepositoriesList, SearchRepo } from "../components";

export default function SelectRepositories() {
    const { data: user } = useAuth();
    const { data: oauthData, isLoading: isOAuthLoading } = useOAuth();
    const updateSelectedRepo = useSelectedRepo((state) => state.updateSelectedRepo);
    const navigate = useNavigate();
    const params = useParams();

    const handleGithubOAuth = () => {
        if (!user) return;
        const githubOAuthUrl = getGitHubUrl(OAUTH_TYPE["GRANT"], window.location.pathname);
        window.location.href = githubOAuthUrl;
    };

    const handleSelectRepo = (repo: IGithubRepo) => {
        updateSelectedRepo(repo);
        navigate(`/app/services/new/${params["type"]}`);
    };

    if (isOAuthLoading) return <Progress size="xs" isIndeterminate colorScheme="teal" />;

    return (
        <TitleLayout
            title={
                <Text fontSize="2xl" mb={8}>
                    Create a new{" "}
                    <strong>{params["type"] === ESelectRepo["web"] ? "Web Services" : "Static Site"}</strong>
                </Text>
            }
        >
            <Flex gap={8}>
                <Flex
                    gap={3}
                    direction="column"
                    flex={2}
                    borderWidth={1}
                    borderStyle="solid"
                    borderColor="gray.300"
                    borderRadius={4}
                    height="400px"
                    p={5}
                >
                    <Heading as="h4" size="sm">
                        Connect a repository
                    </Heading>
                    <SearchRepo />
                    {oauthData?.length ? (
                        <RepositoriesList onSelectedRepo={handleSelectRepo} oauth={oauthData[0]} />
                    ) : (
                        <Flex
                            borderRadius={4}
                            flex={1}
                            align="center"
                            justify="center"
                            overflow="auto"
                            borderWidth={1}
                            borderStyle="solid"
                            borderColor="gray.300"
                        >
                            <Button
                                leftIcon={<Icon as={BsGithub} />}
                                size="lg"
                                colorScheme="teal"
                                onClick={handleGithubOAuth}
                            >
                                Connect GitHub
                            </Button>
                        </Flex>
                    )}
                </Flex>
                <Box flex={1}>
                    <Flex align="center" gap={2}>
                        <Icon as={BsGithub} fontSize="xl" />
                        <Text fontSize="xl" as="b">
                            Github
                        </Text>
                    </Flex>
                    {oauthData?.length ? (
                        <Link to={oauthData?.[0]?.url} target="_blank">
                            <Flex align="center" gap={1}>
                                <Icon as={FcOk} />
                                <Avatar size="xs" src={oauthData?.[0]?.avatarUrl} />
                                <Text fontSize="sm">@{oauthData?.[0]?.username}</Text>
                                <Icon as={BiLinkExternal} />
                            </Flex>
                        </Link>
                    ) : (
                        <Button colorScheme="purple" variant="ghost" onClick={handleGithubOAuth}>
                            <Flex my={4} align="center" gap={1}>
                                <Icon as={BsFillPlusCircleFill} />
                                <Text fontSize="sm">Connect account</Text>
                            </Flex>
                        </Button>
                    )}
                </Box>
            </Flex>
        </TitleLayout>
    );
}
