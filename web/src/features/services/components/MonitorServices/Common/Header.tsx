import { PUBLIC_DOMAIN } from "@/configs";
import { EDeploymentType, IDeployment } from "@/features/services";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Button,
    Divider,
    Flex,
    HStack,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    VStack,
} from "@chakra-ui/react";
import { BsGithub } from "react-icons/bs";
import { IoMdGitBranch } from "react-icons/io";
import { LuExternalLink } from "react-icons/lu";
import { MdOutlineWebAsset } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { Link } from "react-router-dom";

export function ServicesMonitorHeader({ deployment }: { deployment: IDeployment }) {
    return (
        <HStack justifyContent="space-between" padding={8}>
            <VStack align="start" gap={3}>
                <HStack>
                    {deployment.type === EDeploymentType.WEB ? (
                        <>
                            <Icon as={TbWorld} />
                            <Text>WEB SERVICE</Text>
                        </>
                    ) : (
                        <>
                            <Icon as={MdOutlineWebAsset} />
                            <Text>STATIC</Text>
                        </>
                    )}
                </HStack>
                <Flex>
                    <Text fontSize="xl" fontWeight={600}>
                        {deployment.name}
                    </Text>
                </Flex>
                <Link target="_blank" to={deployment.repo_url + "/tree/" + deployment.branch}>
                    <HStack _hover={{ textDecoration: "underline" }}>
                        <Icon as={BsGithub} fontSize="md" />
                        <Text fontSize="sm">{deployment.oauth.username} / {deployment.repo}</Text>
                        <Icon as={IoMdGitBranch} fontSize="md" />
                        <Text fontSize="sm">{deployment.branch}</Text>
                    </HStack>
                </Link>
                <Link to={`https://${deployment.domain}.${PUBLIC_DOMAIN}`} target="_blank">
                    <HStack color="purple.600">
                        <Text fontSize="sm">{deployment.domain}.{PUBLIC_DOMAIN}</Text>
                        <Icon as={LuExternalLink}></Icon>
                    </HStack>
                </Link>
            </VStack>
            <HStack>
                <Menu>
                    <MenuButton colorScheme="teal" fontSize="sm" as={Button} rightIcon={<ChevronDownIcon />}>
                        Manual Deploy
                    </MenuButton>
                    <MenuList fontSize="sm">
                        <MenuItem>Deploy latest commit</MenuItem>
                        <MenuItem>Deploy a specific commit</MenuItem>
                        <MenuItem>Clear build cache & deploy</MenuItem>
                        <Divider />
                        <MenuItem>Restart service</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
        </HStack>
    );
}
