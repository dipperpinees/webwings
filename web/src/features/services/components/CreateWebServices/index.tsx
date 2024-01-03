import { TitleLayout } from "@/components";
import { useSelectedRepo } from "@/stores";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBranchesList, useCurrentRuntime, useRuntimesList } from "../../api";
import { SelectBranch, SelectRuntime, ServiceName } from "../Form";

export function CreateWebService() {
    const selectedRepo = useSelectedRepo((state) => state.selectedRepo);
    const { data: branchesData } = useBranchesList(
        { repo: selectedRepo?.name, username: selectedRepo?.owner.login },
        { enabled: !!selectedRepo },
    );
    const { data: runtimesData } = useRuntimesList();
    const { data: currentRuntime } = useCurrentRuntime(selectedRepo?.language, { enabled: !!selectedRepo });
    const [selectedRuntime, setSelectedRuntime] = useState<string>("");

    useEffect(() => {
        currentRuntime && setSelectedRuntime(currentRuntime);
    }, [currentRuntime]);

    if (!selectedRepo) return <></>;

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
            <form>
                <Flex py={8} direction="column" gap={8}>
                    <ServiceName name="web service" />
                    <SelectBranch name="web service" branches={branchesData} />
                    <SelectRuntime
                        name="web service"
                        runtimes={runtimesData}
                        value={selectedRuntime}
                        onChange={setSelectedRuntime}
                    />
                </Flex>
            </form>
        </TitleLayout>
    );
}
