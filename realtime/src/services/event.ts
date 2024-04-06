import prisma from "@/prisma";

class EventService {
    create() {
        prisma.events.create({
            data: {
                
            }
        })
    }
}