import 'module-alias/register';
import dotenv from 'dotenv';
import initEventConsumer from './lib/amqp/consumer/event';

dotenv.config();

initEventConsumer();