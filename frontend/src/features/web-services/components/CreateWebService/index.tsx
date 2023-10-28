import { Container, Flex, FormControl, FormLabel, Input, Text, Select } from '@chakra-ui/react';
import { GithubRepo } from '../../types/Repositories';
import { Link } from 'react-router-dom';
import useBranchesList from '../../api/useBranchesList';
import useRuntimesList from '../../api/useRuntimesList';

interface ICreateWebServiceProps {
    repo: GithubRepo;
}

export default function CreateWebService({ repo }: ICreateWebServiceProps) {
    const { data: branchesData } = useBranchesList({ repo: repo.name, username: repo.owner.login })
    const {data: runtimesData} = useRuntimesList();

    return (
        <Container
            maxW="container.lg"
            py={6}
        >
            <Text
                as="h5"
                fontSize="2xl"
                fontWeight={600}
            >
                You are deploying a web service for{' '}
                <Link
                    to={repo.url}
                    target="_blank"
                >
                    <Text
                        fontWeight={700}
                        display="inline"
                        color="teal.600"
                    >
                        {repo.full_name}
                    </Text>
                </Link>
            </Text>
            <form>
                <Flex py={8} direction="column" gap={8}>
                    <FormControl>
                        <Flex w="100%">
                            <Flex direction="column" flex={1}>
                                <FormLabel m={0}>
                                    <Text fontWeight={700}>Name</Text>
                                </FormLabel>
                                <Text>A unique name for your web service.</Text>
                            </Flex>
                            <Flex flex={2}>
                                <Input
                                    placeholder="example-service-name"
                                    py={5}
                                />
                            </Flex>
                        </Flex>
                    </FormControl>
                    <FormControl>
                        <Flex w="100%">
                            <Flex direction="column" flex={1}>
                                <FormLabel m={0}>
                                    <Text fontWeight={700}>Branch</Text>
                                </FormLabel>
                                <Text>The repository branch used for your web service.</Text>
                            </Flex>
                            <Flex flex={2}>
                                <Select py={5}>
                                    {branchesData?.map(branch => (
                                        <option value={branch.name} key={branch.name}>{branch.name}</option>
                                    ))}
                                </Select>
                            </Flex>
                        </Flex>
                    </FormControl>
                    <FormControl>
                        <Flex w="100%" align="center">
                            <Flex direction="column" flex={1} >
                                <FormLabel m={0}>
                                    <Text fontWeight={700}>Runtime</Text>
                                </FormLabel>
                                <Text>The runtime for your web service.</Text>
                            </Flex>
                            <Flex flex={2}>
                                <Select py={5}>
                                    {runtimesData?.map(({runtime, id}) => (
                                        <option value={id} key={id}>{runtime}</option>
                                    ))}
                                </Select>
                            </Flex>
                        </Flex>
                    </FormControl>
                </Flex>
            </form>
        </Container>
    );
}
