import Fastify from "fastify"
import cors from "@fastify/cors"
import { PrismaClient } from "@prisma/client"

const app = Fastify();
const prisma = new PrismaClient()

app.register(cors)

app.get("/", async () => {
    const habits = await prisma.habit.findMany({
        where: {
            created_at: {
                gte: new Date(new Date().getTime() - 10 * 60 * 1000)
            }
        }
    })

    return habits
})

app.listen({
    port: 3333,
}).then(() => console.log("Server running on http://localhost:3333"))