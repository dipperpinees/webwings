import { IDeployment } from "@/features/services";
import { Box, Button, Container, Flex, Icon, Input, InputGroup, InputLeftElement, Progress, Text, VStack } from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDeploymentList } from "../api";
import { DeploymentTable } from "../components";
import { TbWorld } from "react-icons/tb";

export default function Dashboard() {
    const { data, isLoading } = useDeploymentList();
    const navigate = useNavigate();

    const handleOpenService = (item: IDeployment) => {
        navigate(`/app/services/monitor/${item.id}`);
    };

    const handleOpenSettingsService = (item: IDeployment) => {
        navigate(`/app/services/monitor/${item.id}?tab=Settings`);
    };

    if (isLoading) {
        return <Progress size="xs" isIndeterminate colorScheme="teal" />
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex direction="column" gap={4}>
                {!!data?.length ? <>
                    <Text fontSize="xl" as="b">
                        Overview
                    </Text>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Icon color="gray.400" as={IoMdSearch} />
                        </InputLeftElement>
                        <Input placeholder="Search services" fontSize="0.875rem" />
                    </InputGroup>
                    <DeploymentTable data={data} onClickItem={handleOpenService} onClickSettingsItem={handleOpenSettingsService} />
                </> : <Box>
                    <Text as='b' fontSize="x-large">Get started in minutes</Text>
                    <VStack
                        mt={8}
                        align="flex-start"
                        w="260px"
                        borderWidth={1}
                        borderStyle="solid"
                        borderColor="#e5e7eb"
                        borderRadius={4}
                        px={6}
                        py={5}
                        gap={4}
                    >
                        <Flex align="center" gap={2}>
                            <Icon boxSize={6} color="teal" as={TbWorld} />
                            <Text as="b" fontSize="large">Web Services</Text>
                        </Flex>
                        <Text fontSize="sm">
                            Web Services include zero-downtime deploys, persistent storage and PR previews. Scale up and down with ease.
                        </Text>
                        <Button variant="outline" size='sm' onClick={() => navigate("/app/select-repo/web")}>New Web Service</Button>
                    </VStack>
                </Box>}
            </Flex>
        </Container>
    );
}
