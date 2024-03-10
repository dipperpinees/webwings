import { EDeploymentType, IDeployment } from "@/features/services";
import capitalizeFirstLetter from "@/utils/capitalize-first-letter";
import {getTimeAgo} from "@/utils/time";
import {
    Button,
    Flex, Icon, Menu,
    MenuButton, MenuItem, MenuList, Table, TableContainer, Tbody, Td, Th, Thead, Tr
} from "@chakra-ui/react";
import { IoIosMore } from "react-icons/io";
import { MdOutlineWebAsset } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import DeploymentStatus from "../DeploymentStatus";

interface IDeploymentTable {
    data: IDeployment[];
    onClickItem: (item: IDeployment) => void;
}

export function DeploymentTable({ data, onClickItem }: IDeploymentTable) {
    return (
        <TableContainer>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>SERVICE NAME</Th>
                        <Th>STATUS</Th>
                        <Th>TYPE</Th>
                        <Th>RUNTIME</Th>
                        <Th>LAST DEPLOYED</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((item) => (
                        <Tr
                            fontSize="0.875rem"
                            _hover={{ cursor: "pointer", backgroundColor: "gray.100" }}
                            onClick={() => onClickItem(item)}
                        >
                            <Td fontWeight={600}>
                                <Flex gap={2} align="center">
                                    <Icon as={item.type === EDeploymentType.STATIC ? MdOutlineWebAsset : TbWorld} />
                                    {item.name}
                                </Flex>
                            </Td>
                            <Td>
                                <DeploymentStatus status={item.status} />
                            </Td>
                            <Td>{capitalizeFirstLetter(item.type)}</Td>
                            <Td>{item.type === EDeploymentType.STATIC ? "Static" : ""}</Td>
                            <Td>{getTimeAgo(new Date(item.updated_at))}</Td>
                            <Td paddingInlineStart="var(--chakra-space-2)" onClick={(e) => e.stopPropagation()}>
                                <Menu>
                                    <MenuButton as={Button} bgColor="transparent">
                                        <Icon boxSize={6} as={IoIosMore} />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem>Download</MenuItem>
                                        <MenuItem>Create a Copy</MenuItem>
                                        <MenuItem>Mark as Draft</MenuItem>
                                        <MenuItem>Delete</MenuItem>
                                        <MenuItem>Attend a Workshop</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
