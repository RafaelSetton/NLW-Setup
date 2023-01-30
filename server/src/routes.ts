import dayjs from "dayjs"
import { FastifyInstance, FastifyRequest } from "fastify"
import { z } from 'zod'
import { db } from "./lib/firebase"
import { v4 as uuidv4 } from 'uuid'
import { FieldValue } from 'firebase-admin/firestore'
import getUserData, { getUserDoc } from "./utils/getUserData"

async function getUserFromRequest(request: FastifyRequest): Promise<string> {
    const summaryHeaders = z.object({
        token: z.string().uuid()
    })

    const { token } = summaryHeaders.parse(request.headers)
    const doc = await db.collection("tokens").doc(token).get()
    const email = doc.data()?.email

    if (!email) throw Error()

    return email
}

function today() { return dayjs().add(dayjs().utcOffset(), 'minute').startOf("day").add(dayjs().utcOffset(), 'minute').toDate() }

export default async function appRoutes(app: FastifyInstance) {
    // Rota para Ping do Uptime Robot

    app.head("/", async (request) => {
        console.log("Ping!")
        return {
            message: "Server running",
            host: request.hostname,
            statusCode: 200,
        }
    })

    // Rotas gerais da aplicação

    app.post("/habits", async (request) => {
        const email = await getUserFromRequest(request)

        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        console.log(`Creating habit '${title}' at (${today().toISOString()}) for user id='${email}'`)

        const habitData = {
            id: uuidv4(),
            title,
            createdAt: today().toISOString(),
            weekDays,
        }
        await db.collection("users").doc(email).update({
            habits: FieldValue.arrayUnion(habitData)
        })
        return habitData
    })

    app.get("/day", async (request) => {
        const email = await getUserFromRequest(request)

        const getDayQueryParams = z.object({
            date: z.coerce.date()
        })

        const date = dayjs(getDayQueryParams.parse(request.query).date).subtract(dayjs().utcOffset(), 'minutes')
        console.log(`Getting day: ${date.toISOString()} for user id='${email}'`)

        const user = await getUserData(email)

        const possibleHabits = user.habits.filter(habit => {
            return (habit.weekDays.includes(date.get('day')) && !habit.createdAt.isAfter(date))
        })

        let completedHabits = user.days.find(d => d.date.isSame(date.add(dayjs().utcOffset(), 'minutes')))?.completed ?? []

        return {
            possibleHabits,
            completedHabits
        }

    })

    app.patch("/habits/:habitId/toggle", async (request) => {
        const email = await getUserFromRequest(request)

        const toggleHabitParams = z.object({
            habitId: z.string().uuid(),
        })

        const { habitId } = toggleHabitParams.parse(request.params)

        console.log(`Toggling habit id='${habitId}' at (${today().toISOString()}) for user id='${email}'`)

        const user = await getUserData(email)
        const day = user.days.find(d => {
            return d.date.isSame(today())
        })
        const doc = getUserDoc(email)

        if (!day) {
            doc.update({
                days: FieldValue.arrayUnion({
                    date: today().toISOString(),
                    completed: [habitId],
                })
            })
        } else {
            doc.update({
                days: user.days.map(d => {
                    if (d != day) return d;

                    if (d.completed.includes(habitId)) {
                        d.completed = d.completed.filter(h => h != habitId)
                    } else {
                        d.completed.push(habitId)
                    }
                    return d;
                }).map(d => {
                    return {
                        date: d.date.toISOString(),
                        completed: d.completed,
                    }
                })
            })
        }
        return {
            status: !day?.completed.includes(habitId),
        }

    })

    app.get("/summary", async (request, response) => {
        const email = await getUserFromRequest(request)
        const user = await getUserData(email)

        console.log(`Getting summary for ${email}`)

        let summary = user.days.map(day => {
            return {
                date: day.date,
                possible: user.habits.filter(habit => {
                    return (habit.weekDays.includes(day.date.subtract(dayjs().utcOffset(), 'minutes').get('day')) && !habit.createdAt.isAfter(day.date))
                }).length,
                completed: day.completed.length
            }
        })

        return summary
    })

    app.post("/register", async (request) => {
        const createUserBody = z.object({
            email: z.string(),
            name: z.string(),
            password: z.string(),
        })

        const { email, name, password } = createUserBody.parse(request.body)

        console.log(`Creating user '${name}'`)

        const token = uuidv4()
        await db.collection("users").doc(email).set({
            name,
            password,
            email,
            token,
            habits: [],
            days: [],
        })
        await db.collection("tokens").doc(token).set({ email })

        return {
            message: "Usuário criado com sucesso",
            statusCode: 200,
            token,
        }
    })

    app.post("/login", async (request, response) => {
        const getUserBody = z.object({
            email: z.string(),
            password: z.string(),
        })

        const { email, password } = getUserBody.parse(request.body)

        const userDoc = await getUserDoc(email).get()
        const user = await getUserData(email)

        console.log(user)

        if (!userDoc.exists) {
            response.statusCode = 400
            return {
                error: "Bad Request",
                message: "Usuário Inválido",
                statusCode: 400,
            }
        }
        if (password != user.password) {
            response.statusCode = 401
            return {
                error: "Unauthorized",
                message: "Senha Incorreta",
                statusCode: 401,
            }
        }

        return {
            message: "Login bem sucedido",
            statusCode: 200,
            token: user.token,
        }
    })
}
