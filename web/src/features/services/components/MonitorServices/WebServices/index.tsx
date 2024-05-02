import { EEventType, IEvent } from "@/features/services";
import { useDeployment, useForceDeploy } from "@/features/services/api";
import { useSocket } from "@/providers/ws";
import { Box, Divider, Flex, HStack, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { EventList, Log, ServicesMonitorHeader, SettingService } from "../Common";

export function WebServicesMonitor() {
    const { id } = useParams();
    const { data: deployment } = useDeployment(id as string);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [newEvent, setNewEvent] = useState<IEvent | undefined>();
    const isNewEventRef = useRef<boolean>(false);
    const socket = useSocket();
    const toast = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedTab = searchParams.get("tab") || "Events"
    const {mutateAsync: forceDeploy} = useForceDeploy();
    if (!deployment) return <></>;

    useEffect(() => {
        if (deployment) setEvents(deployment.event);
    }, [deployment])

    useEffect(() => {
        socket?.emit("join_event", id);
    }, [socket])

    useEffect(() => {
        const handleEvent = (msg: IEvent) => {
            isNewEventRef.current = true;
            setNewEvent(msg);
        };
        socket?.on("event", handleEvent)

        return () => {
            socket?.off('event', handleEvent);
        }
    }, [socket])

    useEffect(() => {
        if (newEvent && isNewEventRef.current) {
            if (newEvent.type === EEventType.DEPLOY_SUCCESS) {
                toast({
                    title: 'Deploy deployment successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
            setEvents([newEvent, ...events]);
            isNewEventRef.current = false;
        }
    }, [newEvent, events])

    return (
        <>
            <ServicesMonitorHeader deployment={deployment} onForceDeploy={() => forceDeploy(id as string)} />
            <Divider />
            <HStack px={8} my={10} align="start" gap={8}>
                <VStack align="start" flex={1}>
                    {["Events", "Logs", "Settings"].map((text) => (
                        <Flex width="100%" gap={1}>
                            <Box height="36px" width="2.5px" bgColor={text === selectedTab ? "blue.400" : "white"}></Box>
                            <Box flex={1} onClick={() => setSearchParams({tab: text})} key={text} px={5} py={2} fontSize="14px" bgColor={selectedTab === text ? "blue.50" : "white"} borderRadius={6} _hover={{ cursor: "pointer", bgColor: "blue.100" }}>
                                {text}
                            </Box>
                        </Flex>
                    ))}
                </VStack>
                <Box flex={5}>
                    {selectedTab === "Events" && <>
                        {deployment && <EventList events={events} />}
                    </>}
                    {selectedTab === "Logs" && <>
                        <Log />
                    </>}
                    {selectedTab === "Settings" && <>
                        <SettingService />
                    </>}
                </Box>
            </HStack>
        </>
    );
}