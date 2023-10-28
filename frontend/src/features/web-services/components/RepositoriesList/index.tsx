import getTimeAgo from '@/utils/timeSince';
import { Button, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import { AiOutlineLock } from 'react-icons/ai';
import { BsGithub } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import useRepositoriesList from '../../api/useRepositoriesList';
import { GithubRepo } from '../../types/Repositories';

interface IRepositoriesListProps {
    setSelectedRepo: (repo: GithubRepo) => void
}

export default function RepositoriesList({setSelectedRepo}: IRepositoriesListProps) {
    const { data: repos, isLoading, isRefetching } = useRepositoriesList();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    
    // const handleGetMoreData = () => {
    //     if (!repos?.pageInfo.hasNextPage) return;
    //     if (isRefetching) return;
    //     refetchRepos();
    // }

    // useEffect(() => {
    //     function handleScroll() {
    //         if (Number(scrollRef.current?.scrollTop) + Number(scrollRef.current?.clientHeight) === scrollRef.current?.scrollHeight) {
    //             handleGetMoreData()
    //         }
    //     }

    //     scrollRef.current?.addEventListener('scroll', handleScroll);

    //     return () => {
    //         scrollRef.current?.removeEventListener('scroll', handleScroll);
    //     };
    // }, [repos]);

    if (isLoading)
        return (
            <Flex
                flex="1"
                align="center"
                justify="center"
            >
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="teal"
                    size="xl"
                />
            </Flex>
        );

    return (
        <Flex
            ref={scrollRef}
            overflow="auto"
            border="1px solid #aed4c6"
            borderRadius={4}
            flex={1}
            direction="column"
        >
            {repos?.map((repo) => (
                <Flex
                    align="center"
                    gap={2}
                    px={3}
                    py={4}
                    borderBottom="1px solid #aed4c6"
                    key={repo.id}
                >
                    <Icon
                        as={BsGithub}
                        fontSize="xl"
                    />
                    <Link
                        to={repo.html_url}
                        target="_blank"
                    >
                        <Text
                            fontSize="0.875rem"
                            _hover={{ textDecoration: 'underline' }}
                        >
                            @{repo.full_name}
                        </Text>
                    </Link>
                    {repo.private && <Icon as={AiOutlineLock} />}
                    <Text fontSize="0.875rem">• {getTimeAgo(new Date(repo.updated_at))}</Text>
                    <Button
                        colorScheme="teal"
                        size="sm"
                        marginLeft="auto"
                        onClick={() => setSelectedRepo(repo)}
                    >
                        Connect
                    </Button>
                </Flex>
            ))}
            {isRefetching && <Flex p={3} justify="center">
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="teal"
                    size="lg"
                />
            </Flex>}
        </Flex>
    );
}
