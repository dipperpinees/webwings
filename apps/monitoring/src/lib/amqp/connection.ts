import amqplib from "amqplib";

let instance: Amqp;
let conn: amqplib.ChannelModel;

class Amqp {
    constructor() {
        if (instance) {
          throw new Error("You can only create one instance!");
        }
        instance = this;
    }

    async getConn() :Promise<amqplib.ChannelModel> {
        if (conn) return conn;
        const _conn = await amqplib.connect(process.env.AMQP_URI as string);
        conn = _conn;
        return conn;
    }
}

const amqp = Object.freeze(new Amqp());
export default amqp;