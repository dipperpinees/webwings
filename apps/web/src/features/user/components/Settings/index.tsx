import { IUser, useAuth } from "@/features/auth";
import {
    Button,
    Divider,
    HStack,
    Heading,
    Input,
    Spinner,
    Stack,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import isEqual from "lodash.isequal";

export function UserSettings() {
    const { data: user } = useAuth();
    const [userProfile, serUserProfile] = useState<IUser | undefined>();
    const [isDirty, setIsDirty] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;
        serUserProfile(user);
    }, [user]);

    useEffect(() => {
        setIsDirty(isEqual(user, userProfile));
    }, [user, userProfile]);

    if (!userProfile) return <Spinner />;

    return (
        <Stack>
            <form>
                <VStack
                    align="start"
                    gap={4}
                    borderWidth={1}
                    borderStyle="solid"
                    borderColor="gray.300"
                    borderRadius={4}
                    p={5}
                >
                    <Heading as="h5" size="md" fontWeight={500}>
                        Profile
                    </Heading>
                    <Divider />
                    <HStack width="100%">
                        <Text color={useColorModeValue("gray.500", "white")} flex={1}>
                            CONTACT EMAIL
                        </Text>
                        <Text flex={8}>{userProfile.email}</Text>
                    </HStack>
                    <HStack width="100%">
                        <Text color={useColorModeValue("gray.500", "white")} flex={1}>
                            FULL NAME
                        </Text>
                        <Input
                            flex={8}
                            value={userProfile.name}
                            onChange={(e) => serUserProfile({ ...userProfile, name: e.target.value })}
                        />
                    </HStack>
                    <Button fontWeight={500} variant="outline" isDisabled={isDirty} fontSize="sm">
                        Save Changes
                    </Button>
                </VStack>
            </form>
        </Stack>
    );
}
