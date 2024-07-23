import { EEventType, IEvent } from "@/features/services";
import { useDeployment } from "@/features/services/api";
import { getTimeString } from "@/utils/time";
import { Divider, HStack, Icon, Link, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { MdCloud, MdCloudDone, MdCloudUpload, MdError } from "react-icons/md";
import { useParams } from "react-router-dom";

export function Event({ event }: { event: IEvent }) {
    const { id } = useParams();
    const { data: deployment } = useDeployment(id as string);
    const EventIcon = useMemo(() => {
        switch (event.type) {
            case EEventType.INIT_DEPLOY:
            case EEventType.NEW_DEPLOY:
                return <Icon as={MdCloudUpload} boxSize={7} color="gray.500" />;
            case EEventType.DEPLOY_SUCCESS:
                return <Icon as={MdCloudDone} boxSize={7} color="teal" />;
            case EEventType.DEPLOY_FAILED:
                return <Icon as={MdError} boxSize={7} color="red.400" />;
            case EEventType.DEPLOY_CANCEL:
                return <Icon as={MdCloud} boxSize={7} color="gray.500" />;
            default:
                return <Icon as={MdCloudUpload} boxSize={7} color="gray.500" />;
        }
    }, [event, deployment])

    const EventText = useMemo(() => {
        switch (event.type) {
            case EEventType.INIT_DEPLOY:
                return <>First <Link color="teal">deploy</Link> for started for <Link href={"#"} target="_blank" color="teal">{event.commit_sha.substring(0, 7)}</Link><Text display="inline" color="gray">: {event.commit_msg}</Text></>;
            case EEventType.NEW_DEPLOY:
                return <>Deploy started for <Link href={`${deployment?.repo_url}/commit/${event.commit_sha}`} target="_blank" color="teal">{event.commit_sha.substring(0, 7)}</Link><Text display="inline" color="gray">: {event.commit_msg}</Text></>;
            case EEventType.DEPLOY_SUCCESS:
                return <>Deploy live for <Link href={`${deployment?.repo_url}/commit/${event.commit_sha}`} target="_blank" color="teal">{event.commit_sha.substring(0, 7)}</Link><Text display="inline" color="gray">: {event.commit_msg}</Text></>;
            case EEventType.DEPLOY_FAILED:
                return <>Deploy failed for <Link href={`${deployment?.repo_url}/commit/${event.commit_sha}`} target="_blank" color="teal">{event.commit_sha.substring(0, 7)}</Link><Text display="inline" color="gray">: {event.commit_msg}</Text></>;
            case EEventType.DEPLOY_CANCEL:
                return <>Deploy canceled for <Link href={`${deployment?.repo_url}/commit/${event.commit_sha}`} target="_blank" color="teal">{event.commit_sha.substring(0, 7)}</Link><Text display="inline" color="gray">: {event.commit_msg}</Text></>;
            default:
                return <></>
        }
    }, [event, deployment])

    return (
        <HStack gap={5} px={5} py={4}>
            {EventIcon}
            <VStack align="flex-start" gap={1}>
                <Text>
                    {EventText}
                </Text>
                <Text as="span" fontSize="xs" color="gray.500">
                    {getTimeString(new Date(event.created_at))}
                </Text>
            </VStack>
        </HStack>
    )
}

export function EventList({ events }: { events: IEvent[] }) {
    return (
        <VStack align="flex-start" border="1px solid #E2E8F0" borderRadius={8}>
            {events.map((event) => (
                <>
                    <Event event={event} />
                    <Divider/>
                </>
            ))}
        </VStack>
    );
}
