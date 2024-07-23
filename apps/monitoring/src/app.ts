import moduleAlias from 'module-alias';
moduleAlias.addAlias('@', __dirname);
import dotenv from 'dotenv';
import initEventConsumer from './lib/amqp/consumer/event';
import express from 'express';
import http from 'http';
import wsHandler from './lib/ws';
import initBuildLogsConsumer from './lib/amqp/consumer/build-logs';

const app = express();
const server = http.createServer(app);

const io = wsHandler(server);

const PORT = process.env.PORT || 3335;
server.listen(PORT, () => {
    console.log('listening on *:', PORT);
});

dotenv.config();

initEventConsumer(io);
initBuildLogsConsumer(io);
