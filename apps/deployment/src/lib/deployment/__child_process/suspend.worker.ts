import Kubectl from '@/lib/kubectl';
import 'module-alias/register';
import 'reflect-metadata';
import Container from 'typedi';

const deploymentID = process.argv[2];

const kubectl = Container.get(Kubectl);

kubectl.suspend(deploymentID)
.then(() => {
    console.log("Suspend deployment successfully")
})