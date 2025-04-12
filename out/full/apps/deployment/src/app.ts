import dotenv from 'dotenv';
import moduleAlias from 'module-alias';
moduleAlias.addAlias('@', __dirname);
import 'reflect-metadata';
import Container from 'typedi';
import { DeploymentConsumer } from './lib/amqp';

dotenv.config();

const deploymentConsumer = Container.get(DeploymentConsumer);

deploymentConsumer.init().catch((err) => {
    throw err;
});
