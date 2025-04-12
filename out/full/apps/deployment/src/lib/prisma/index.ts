import { Service } from "typedi";
import { PrismaClient } from '@prisma/client'

@Service()
export default class Prisma {
    client: PrismaClient;
    constructor() {
        this.client = new PrismaClient()
    }
}