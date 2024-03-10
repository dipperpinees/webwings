import { IEvent } from "@/features/services";
import { getTimeString } from "@/utils/time";
import { Divider, HStack, Icon, Link, Text, VStack } from "@chakra-ui/react";
import { MdCloudUpload } from "react-icons/md";

export function Event({ event }: { event: IEvent }) {
    return (
        <HStack gap={5} px={5} py={4}>
            <Icon as={MdCloudUpload} boxSize={5} color="gray.500" />
            <VStack align="flex-start" gap={1}>
                <Text>
                    First <Link color="teal">deploy</Link> for started for <Link href={event.commit_url} target="_blank" color="teal">{event.commit_sha.substring(0, 7)}</Link>
                </Text>
                <Text as="span" fontSize="xs" color="gray.500">
					{getTimeString(new Date(event.created_at))}
                </Text>
            </VStack>
        </HStack>
    );
}

export function EventList({ events }: { events: IEvent[] }) {
    return (
        <VStack align="flex-start" border="1px solid #E2E8F0" borderRadius={8}>
            {events.map((event) => (
                <>
                    <Event event={event} />
                    <Divider />
                </>
            ))}
        </VStack>
    );
}
