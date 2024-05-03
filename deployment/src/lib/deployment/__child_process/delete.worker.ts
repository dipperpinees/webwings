import 'module-alias/register';
import 'reflect-metadata';
import Container from 'typedi';
import Kubectl from '@/lib/kubectl';

const deploymentID = process.argv[2];

const kubectl = Container.get(Kubectl);

kubectl.delete(deploymentID)
.then(() => {
    console.log("Delete deployment successfully")
})