import { ELogType, ILog } from "@/features/services";
import { useSocket } from "@/providers/ws";
import { getTimeString } from "@/utils/time";
import { Icon, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MdError, MdInfo } from "react-icons/md";
import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";

export function Log() {
    const socket = useSocket();
    const { id } = useParams();
    const [logData, setLogData] = useState<ILog[]>([]);
    const isNewLog = useRef(false);
    const [newLog, setNewLog] = useState<ILog[]>();

    useEffect(() => {
        socket?.emit("join_logs", id);

        return () => {
            socket?.emit("out_logs", id);
        };
    }, [socket]);

    useEffect(() => {
        const handleEvent = (msg: ILog[]) => {
            isNewLog.current = true;
            setNewLog(msg);
        };
        socket?.on("logs", handleEvent);

        return () => {
            socket?.off("logs", handleEvent);
        };
    }, [socket]);

    useEffect(() => {
        if (!isNewLog.current || !newLog) return;
        // const IS_SCROLL_TO_BOTTOM = isScrollToBottom();

        setLogData([...logData, ...newLog]);
        isNewLog.current = false;

        // setTimeout(() => {
        //     IS_SCROLL_TO_BOTTOM && scrollToBottom();
        // }, 20)
    }, [newLog]);

    // useEffect(() => {
    //     scrollToBottom()
    // }, [])

    // useEffect(() => {
    //     setTimeout(() => {
    //         const IS_SCROLL_TO_BOTTOM = isScrollToBottom();
    //         setLogData([
    //             {
    //                 time: "Apr 7 06:42:56 PM",
    //                 data: "[GIN-debug] POST   /api/password/reset   github.com/hiepnguyen223/int3306-project/controllers.AuthController.ResetPassword-fm (6 handlers)"
    //             },
    //             ...logData
    //         ])
    //         setTimeout(() => {
    //             IS_SCROLL_TO_BOTTOM && scrollToBottom();
    //         }, 100)
    //     }, 2000)
    // }, [logData])

    // const isScrollToBottom = () => {
    //     if (!boxRef.current) return false;
    //     return Math.ceil(boxRef.current.scrollHeight - boxRef.current.scrollTop) === boxRef.current.clientHeight
    // }

    // const scrollToBottom = () => {
    //     if (!boxRef.current) return false;
    //     boxRef.current.scrollTo({
    //         top: boxRef.current.scrollHeight,
    //         behavior: 'smooth'
    //     });
    // }

    return (
        <ScrollToBottom className="log-box">
            {logData.map(({ time, message, type }, key) => (
                <Text mb={3} key={key} color="white" fontSize="14px">
                    <Text display="inline-block" color="gray.400" width="200px">
                        {getTimeString(new Date(time))}
                    </Text>
                    {type === ELogType.INFO && <Icon as={MdInfo} mr={2} />}
                    {type === ELogType.ERROR && <Icon color="red.500" as={MdError} mr={2} />}
                    {message}
                </Text>
            ))}
        </ScrollToBottom>
    );
}
