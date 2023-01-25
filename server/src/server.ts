import Fastify from "fastify"
import cors from "@fastify/cors"
import appRoutes from "./routes";

const app = Fastify();
const port = (process.env.PORT as number | undefined) || 3333

app.register(cors)
app.register(appRoutes)

app.listen({
    host: '0.0.0.0',
    port,
}).then(() => console.log(`Server running on port ${port}`))