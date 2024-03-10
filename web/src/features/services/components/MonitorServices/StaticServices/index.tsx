import { useDeployment } from "@/features/services/api";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { EventList, ServicesMonitorHeader } from "../Common";

export function StaticServicesMonitor() {
    const { id } = useParams();
    const { data: deployment } = useDeployment(id as string);

    if (!deployment) return <></>;

    return (
        <>
            <ServicesMonitorHeader deployment={deployment} />
            <Tabs>
                <TabList px={4}>
                    <Tab>Events</Tab>
                    <Tab>Settings</Tab>
                </TabList>

                <TabPanels px={4}>
                    <TabPanel>
                        {deployment && <EventList events={deployment.event} />}
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
}
