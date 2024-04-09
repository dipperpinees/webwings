import dotenv from 'dotenv';
import 'module-alias/register';
import 'reflect-metadata';
import Container from 'typedi';
import { DeploymentConsumer } from './lib/amqp';
import { EEvent } from './types';
import { Producer } from './lib/amqp/producers';

dotenv.config();

const deploymentConsumer = Container.get(DeploymentConsumer);

deploymentConsumer.init().catch(err => {
    throw err;
});