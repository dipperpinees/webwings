import { TitleLayout } from "@/components";
import { useSelectedRepo } from "@/stores";
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useBranchesList, useCreateDeployment } from "../../api";
import { AdvancedConfig, BuildCommand, SelectBranch, SelectDirectory, ServiceName } from "../Form";
import { SubmitHandler, useForm } from "react-hook-form";
import { EDeploymentType, IDeployment } from "../..";
import { useState } from "react";

export function CreateWebStatic() {
    const selectedRepo = useSelectedRepo((state) => state.selectedRepo);
    const { data: branchesData } = useBranchesList(
        { repo: selectedRepo?.name, username: selectedRepo?.owner.login },
        { enabled: !!selectedRepo },
    );
    const {
        register,
        formState: { errors },
        handleSubmit,
        control
    } = useForm<IDeployment>();
    const {mutateAsync: createDeployment} = useCreateDeployment();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!selectedRepo) return <></>;

    const onSubmit: SubmitHandler<IDeployment> = async (data) => {
        setIsLoading(true);
        try {
            await createDeployment({
                ...data,
                auto_deploy: !!data.auto_deploy,
                repo_url: selectedRepo.html_url,
                repo: selectedRepo.name,
                oauth_id: selectedRepo.oauth,
                type: EDeploymentType.STATIC
            });
            toast({
                title: "Create web static successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            let message = "Create web static failed";
            if (error instanceof Error) message = error.message;
            toast({
                title: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    };

    return (
        <TitleLayout
            title={
                <Text as="h5" fontSize="2xl" fontWeight={600}>
                    You are deploying a static site for{" "}
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
                        name="static site"
                        inputProps={{...register("name", {
                            required: {
                                value: true,
                                message: "This field is required",
                            },
                        })}}
                        error={errors.name?.message}
                    />
                    <SelectBranch 
                        name="static site" 
                        branches={branchesData} 
                        control={control}
                    />
                    <SelectDirectory inputProps={{...register("root")}} />
                    <BuildCommand inputProps={{...register("build_command")}} />
                    <AdvancedConfig showEnvConfig={false} register={register} />
                </Flex>
                <Button isLoading={isLoading} colorScheme="blue" type="submit">Create static site</Button>
            </form>
        </TitleLayout>
    );
}
