import { EEventType } from "@/features/services";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { IoIosCheckmarkCircle, IoIosTime } from "react-icons/io";
import { MdError } from "react-icons/md";

export default function DeploymentStatus({eventType}: {eventType: EEventType}) {
    switch (eventType) {
        case EEventType.DEPLOY_FAILED:
            return <Flex align="center" gap={1}>
                <Icon color="red" boxSize={5} as={MdError} />
                <Text>Failed</Text>
            </Flex>
        case EEventType.DEPLOY_SUCCESS: {
            return <Flex align="center" gap={1}>
                <Icon color="green" boxSize={5} as={IoIosCheckmarkCircle} />
                <Text>Deployed</Text>
            </Flex>
        }
        default:
            return <Flex align="center" gap={1}>
            <Icon boxSize={5} as={IoIosTime} />
            <Text>Progessing</Text>
        </Flex>
    }
}