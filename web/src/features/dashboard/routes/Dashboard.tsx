import { IDeployment } from "@/features/services";
import { Container, Flex, Icon, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDeploymentList } from "../api";
import { DeploymentTable } from "../components";

export default function Dashboard() {
    const { data } = useDeploymentList();
    const navigate = useNavigate();

    const handleOpenService = (item: IDeployment) => {
        navigate(`/app/services/monitor/${item.id}`);
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Flex direction="column" gap={4}>
                <Text fontSize="xl" as="b">
                    Overview
                </Text>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Icon color="gray.400" as={IoMdSearch} />
                    </InputLeftElement>
                    <Input placeholder="Search services" fontSize="0.875rem" />
                </InputGroup>
                {!!data && <DeploymentTable data={data} onClickItem={handleOpenService} />}
            </Flex>
        </Container>
    );
}
