import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Button, HStack, Text } from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onToggle: (value: boolean) => void;
}

export function ToggleAdvanced({isOpen, onToggle}: Props) {
    return <Button variant='outline' onClick={() => onToggle(!isOpen)}>
        <HStack>
            <Text fontWeight={500} fontSize="sm">Advanced</Text>
            {isOpen ? <ChevronUpIcon fontSize="xl"/> : <ChevronDownIcon fontSize="xl"/>}
        </HStack>
    </Button>
}