import { ConsumeMessage } from 'amqplib';

export const ConsumerMessageHandler = <T>(cb: (data: T) => void) => {
    return (msg: ConsumeMessage | null) => {
        if (!msg || !msg.content) return;
        try {
            const data = JSON.parse(msg.content.toString()) as T;
            return cb(data);
        } catch (e) {}
    };
};
