import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as jwt from "jsonwebtoken";

export default function authenticate(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, next: (err?: ExtendedError | undefined) => void) {
    try {
        if (socket.handshake.query?.token) {
            jwt.verify(socket.handshake.query?.token as string, process.env.JWT_SECRET_KEY as string);
            next();
        } else {
            throw new Error('Authentication error')
        }
    } catch (err: any) {
        next(new Error(err.message));
    }
}