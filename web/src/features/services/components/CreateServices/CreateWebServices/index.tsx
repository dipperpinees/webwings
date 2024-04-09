import { TitleLayout } from "@/components";
import { EDeploymentType, ICreateDeployment } from "@/features/services";
import { useSelectedRepo } from "@/stores";
import { useEnvStore } from "@/stores/env";
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useBranchesList, useCreateDeployment, useCurrentRuntime, useRuntimesList } from "../../../api";
import { AdvancedConfig, BuildCommand, SelectBranch, SelectDirectory, SelectRuntime, ServiceName, StartCommand } from "../Form";

export function CreateWebService() {
    const selectedRepo = useSelectedRepo((state) => state.selectedRepo);
    const { data: branchesData } = useBranchesList(
        { repo: selectedRepo?.name, username: selectedRepo?.owner.login },
        { enabled: !!selectedRepo },
    );
    const { data: runtimesData } = useRuntimesList();
    const { data: currentRuntime } = useCurrentRuntime(selectedRepo?.language, { enabled: !!selectedRepo });
    const [selectedRuntime, setSelectedRuntime] = useState<string>("");
    const [selectedVersionID, setSelectedVersionID] = useState<number>(0)
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        setValue
    } = useForm<ICreateDeployment>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const env = useEnvStore(state => state.env);
    const setEnv = useEnvStore(state => state.updateEnv);
    const toast = useToast();
    const {mutateAsync: createDeployment} = useCreateDeployment();
    const navigate = useNavigate();

    useEffect(() => {
        const foundBuildCommand = runtimesData?.find(({name}) => name === selectedRuntime)?.build_command;
        const foundStartCommand = runtimesData?.find(({name}) => name === selectedRuntime)?.start_command;
        foundBuildCommand && setValue("build_command", foundBuildCommand);
        foundStartCommand && setValue("start_command", foundStartCommand);
    }, [selectedRuntime])

    useEffect(() => {
        () => {
            return setEnv([{
                key: "",
                value: ""
            }])
        }
    }, [])

    useEffect(() => {
        const selectedRuntime = currentRuntime || runtimesData?.[0].name;
        const versionID = Number(runtimesData?.find(({ name }) => name === selectedRuntime)?.versions[0].id);
        selectedRuntime && setSelectedRuntime(selectedRuntime);
        setSelectedVersionID(versionID);
    }, [currentRuntime, runtimesData]);

    if (!selectedRepo) return <></>;

    const onSubmit: SubmitHandler<ICreateDeployment> = async (data) => {
        setIsLoading(true);
        try {
            const newDeployment = await createDeployment({
                ...data,
                auto_deploy: !!data.auto_deploy,
                repo_url: selectedRepo.html_url,
                repo: selectedRepo.name,
                oauth_id: selectedRepo.oauth,
                type: EDeploymentType.WEB,
                env_variables: JSON.stringify(env.filter(({key, value}) => key && value)),
                runtime: selectedVersionID,
            });
            toast({
                title: "Create web service successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate(`/app/services/monitor/${newDeployment.id}`)
        } catch (error) {
            let message = "Create web service failed";
            if (error instanceof Error) message = error.message;
            toast({
                title: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    }

    return (
        <TitleLayout
            title={
                <Text as="h5" fontSize="2xl" fontWeight={600}>
                    You are deploying a web service for{" "}
                    <Link to={selectedRepo.url} target="_blank">
                        <Text fontWeight={700} display="inline" color="teal.600">
                            {selectedRepo.full_name}
                        </Text>
                    </Link>
                </Text>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex py={8} direction="column" gap={8}>
                    <ServiceName 
                        name="web service"
                        inputProps={{...register("name", {
                            required: {
                                value: true,
                                message: "This field is required",
                            },
                        })}}
                        error={errors.name?.message}
                    />
                    <SelectBranch 
                        name="web service" 
                        branches={branchesData}
                        control={control}
                    />
                    <SelectRuntime
                        name="web service"
                        runtimes={runtimesData}
                        runtime={selectedRuntime}
                        onRuntimeChange={setSelectedRuntime}
                        version={selectedVersionID}
                        onVersionChange={setSelectedVersionID}
                    />
                    <SelectDirectory 
                        inputProps={{...register("root")}}
                    />
                    <BuildCommand 
                        inputProps={{...register("build_command")}}
                    />
                    <StartCommand
                        inputProps={{...register("start_command", {
                            required: {
                                value: true,
                                message: "This field is required",
                            },
                        })}}
                        error={errors.start_command?.message}
                    />
                    <AdvancedConfig showEnvConfig={true} register={register} />
                </Flex>
                <Button isLoading={isLoading} colorScheme="teal" type="submit">Create web service</Button>
            </form>
        </TitleLayout>
    );
}
