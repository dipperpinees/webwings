import { TitleLayout } from "@/components";
import { useSelectedRepo } from "@/stores";
import { Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useBranchesList } from "../../api";
import { AdvancedConfig, BuildCommand, SelectBranch, SelectDirectory, ServiceName } from "../Form";
import { SubmitHandler, useForm } from "react-hook-form";
import { IDeployment } from "../..";

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
    } = useForm<IDeployment>();

    if (!selectedRepo) return <></>;

    const onSubmit: SubmitHandler<IDeployment> = () => {};

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
                                message: "Password is required",
                            },
                            minLength: {
                                value: 6,
                                message: "This field has a minimum length of 6",
                            },
                        })}}
                    />
                    <SelectBranch name="static site" branches={branchesData} />
                    <SelectDirectory />
                    <BuildCommand />
                    <AdvancedConfig showEnvConfig={false} />
                </Flex>
                <Button colorScheme="blue" type="submit">Create static site</Button>
            </form>
        </TitleLayout>
    );
}
