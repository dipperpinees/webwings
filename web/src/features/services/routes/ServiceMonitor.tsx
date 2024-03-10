import { Center, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { EDeploymentType } from "..";
import { useDeployment } from "../api";
import { StaticServicesMonitor, WebServicesMonitor } from "../components";

export const ServiceMonitorRoutes = () => {
    const { id } = useParams();
    const { data: deployment } = useDeployment(id as string);

    if (!deployment) {
        return (
            <Center height="calc(100vh - var(--chakra-sizes-16))">
                <Spinner size="xl" color="teal" />
            </Center>
        );
    }

    if (deployment.type === EDeploymentType.STATIC) {
        return <StaticServicesMonitor />
    }

    return <WebServicesMonitor />
};
