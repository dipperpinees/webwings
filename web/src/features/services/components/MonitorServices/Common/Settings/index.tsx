import { PUBLIC_DOMAIN } from "@/configs";
import { useBranchesList, useDeleteDeployment, useDeployment } from "@/features/services/api";
import { useUpdateDeployment } from "@/features/services/api/useUpdateDeployment";
import { IUpdateDeployment } from "@/features/services/types";
import { useEnvStore } from "@/stores/env";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Divider, Flex, HStack, Link, Text, VStack, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react";
import isEqual from "lodash.isequal";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BuildCommand, SelectBranch, SelectDirectory, ServiceName, StartCommand } from "../../../CreateServices/Form";
import { AutoDeploy } from "../../../CreateServices/Form/Advanced/AutoDeploy";
import { EnvironmentVariable } from "../../../CreateServices/Form/Advanced/Environment";

function DeleteButton({onDelete}: {onDelete: () => void}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef(null)

    return (
        <>
            <Button colorScheme='red' onClick={onOpen}>
                Delete Deployment
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Web Service
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={() => {
                                onClose();
                                onDelete();
                            }} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export function SettingService() {
    const { id } = useParams();
    const { data: deployment } = useDeployment(id as string);
    const { data: branchesData } = useBranchesList(
        { repo: deployment?.repo, username: deployment?.oauth.username },
        { enabled: !!deployment },
    );
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        setValue,
        getValues
    } = useForm<IUpdateDeployment>();
    const setEnv = useEnvStore(state => state.updateEnv);
    const env = useEnvStore(state => state.env);
    const [isDirty, setIsDirty] = useState(false);
    const { mutateAsync: updateDeployment } = useUpdateDeployment();
    const toast = useToast();
    const { mutateAsync: deleteDeployment } = useDeleteDeployment();
    const navigate = useNavigate();
    const [_, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!deployment) return;
        setValue("name", deployment.name);
        setValue("build_command", deployment.build_command);
        setValue("start_command", deployment.start_command);
        setValue("root", deployment.root);

        setEnv(JSON.parse(deployment.env))
    }, [deployment])

    const onSubmit: SubmitHandler<IUpdateDeployment> = async (data) => {
        if (!id) return;
        try {
            await updateDeployment({
                ...data,
                id,
                auto_deploy: (data.auto_deploy === "yes") ? true : false,
                env_variables: JSON.stringify(env.filter(({ key, value }) => key && value))
            })
            toast({
                title: "Update web service successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setSearchParams({tab: "Events"})
        } catch (error) {
            let message = "Update web service failed";
            if (error instanceof Error) message = error.message;
            toast({
                title: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleFormChange = () => {
        const currentFormValue = getValues();
        setIsDirty(!isEqual(
            {
                ...deployment,
                ...currentFormValue,
                auto_deploy: (currentFormValue.auto_deploy === "yes") ? true : false,
                env: JSON.stringify(env.filter(({ key, value }) => key && value))
            },
            deployment
        ))
    }

    const handleDelete = async () => {
        await deleteDeployment(id as string);
        toast({
            title: "Delete web service successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        navigate("/app/dashboard")
    }

    return <form onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
        <Flex
            borderWidth={1}
            borderRadius={6}
            borderColor="gray.200"
            py={6}
            px={5}
            direction="column"
            gap={5}
        >
            <Text as="h2" fontWeight={600} fontSize={20}>General</Text>
            <Divider borderColor="gray.300" />
            <Box mt={2}>
                <VStack gap={8}>
                    <ServiceName
                        name="web service"
                        inputProps={{
                            ...register("name", {
                                required: {
                                    value: true,
                                    message: "This field is required",
                                },
                            })
                        }}
                        error={errors.name?.message}
                    />
                    <SelectBranch
                        name="web service"
                        branches={branchesData}
                        control={control}
                        defaultValue={deployment?.branch}
                    />
                    <SelectDirectory
                        inputProps={{ ...register("root") }}
                    />
                    <BuildCommand
                        inputProps={{ ...register("build_command") }}
                    />
                    <StartCommand
                        inputProps={{
                            ...register("start_command", {
                                required: {
                                    value: true,
                                    message: "This field is required",
                                },
                            })
                        }}
                        error={errors.start_command?.message}
                    />
                    <AutoDeploy selectProps={{ ...register("auto_deploy") }} />
                </VStack>
            </Box>
        </Flex>
        <Flex
            borderWidth={1}
            borderRadius={6}
            borderColor="gray.200"
            py={6}
            px={5}
            direction="column"
            gap={5}
            mt={8}
        >
            <Text as="h2" fontWeight={600} fontSize={20}>Custom Domains</Text>
            <Divider borderColor="gray.300" />
            <Box mt={2}>
                <Text color={useColorModeValue("beauty", "white")} fontSize="sm">
                    Your service is always available at <Link color="blue.500" href={`https://${deployment?.domain}.${PUBLIC_DOMAIN}`} target="_blank">https://{deployment?.domain}.{PUBLIC_DOMAIN}</Link>.
                    You can also point custom domains you own to this service.
                </Text>
            </Box>
        </Flex>
        <Flex
            borderWidth={1}
            borderRadius={6}
            borderColor="gray.200"
            py={6}
            px={5}
            direction="column"
            gap={5}
            mt={8}
        >
            <Text as="h2" fontWeight={600} fontSize={20}>Environment Variables</Text>
            <Divider borderColor="gray.300" />
            <Box mt={2}>
                <EnvironmentVariable />
            </Box>
        </Flex>
        <HStack mt={8} gap={6}>
            <Button colorScheme="teal" isDisabled={!isDirty} type="submit">Update Web Service</Button>
            <DeleteButton onDelete={handleDelete}/>
            {/* <Button variant="ghost" color="red">Suspend Web Service</Button> */}
        </HStack>
    </form>
}