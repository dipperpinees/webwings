import getTimeAgo from "@/utils/time-since";
import { Button, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { AiOutlineLock } from "react-icons/ai";
import { BsGithub } from "react-icons/bs";
import { Link, useSearchParams } from "react-router-dom";
import useRepositoriesList from "../../../select-repo/api/useRepositoriesList";
import { IGithubRepo } from "../../../select-repo/types/Repositories";

interface IRepositoriesListProps {
    onSelectedRepo: (repo: IGithubRepo) => void;
}

export function RepositoriesList({ onSelectedRepo }: IRepositoriesListProps) {
    const { data: repos, isLoading, isRefetching } = useRepositoriesList();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [searchParams] = useSearchParams();

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

    const filterRepos = () => {
        const search = searchParams.get("q");
        if (search) {
            return repos?.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));
        }
        return repos;
    };

    if (isLoading)
        return (
            <Flex flex="1" align="center" justify="center">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal" size="xl" />
            </Flex>
        );

    return (
        <Flex
            ref={scrollRef}
            overflow="auto"
            borderWidth={1}
            borderStyle="solid"
            borderColor="gray.300"
            borderRadius={4}
            flex={1}
            direction="column"
        >
            {filterRepos()?.map((repo) => (
                <Flex
                    align="center"
                    gap={2}
                    px={3}
                    py={4}
                    borderBottomWidth={1}
                    borderStyle="solid"
                    borderColor="gray.300"
                    key={repo.id}
                >
                    <Icon as={BsGithub} fontSize="xl" />
                    <Link to={repo.html_url} target="_blank">
                        <Text fontSize="sm" _hover={{ textDecoration: "underline" }}>
                            @{repo.full_name}
                        </Text>
                    </Link>
                    {repo.private && <Icon as={AiOutlineLock} />}
                    <Text fontSize="sm">• {getTimeAgo(new Date(repo.updated_at))}</Text>
                    <Button colorScheme="blue" size="sm" marginLeft="auto" onClick={() => onSelectedRepo(repo)}>
                        Connect
                    </Button>
                </Flex>
            ))}
            {isRefetching && (
                <Flex p={3} justify="center">
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal" size="lg" />
                </Flex>
            )}
        </Flex>
    );
}
