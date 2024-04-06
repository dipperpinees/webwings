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

const producer = Container.get(Producer);
producer.sendEvent({
    commit_sha: "test",
    deploymentID: "6ee8f581-c46c-4a1e-901a-0e674aa8894f",
    type: EEvent.DEPLOY_CANCEL
})