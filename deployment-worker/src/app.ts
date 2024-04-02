import 'reflect-metadata';
import 'module-alias/register';
import dotenv from 'dotenv';
import Container from 'typedi';
import { DeploymentConsumer } from './lib/amqp';
import Cloudflare from './lib/cloudflare';

dotenv.config();

const deploymentConsumer = Container.get(DeploymentConsumer);

deploymentConsumer.init().catch(err => {
    throw err;
});