import dayjs from "dayjs"
import { FastifyInstance, FastifyRequest } from "fastify"
import { z } from 'zod'
import { prisma } from "./lib/prisma"
import { Prisma, User } from "@prisma/client"

async function getUserFromRequest(request: FastifyRequest): Promise<User> {
    const summaryHeaders = z.object({
        token: z.string().uuid()
    })

    const { token } = summaryHeaders.parse(request.headers)

    const userToken = await prisma.token.findUnique({
        where: {
            id: token
        },
        include: {
            user: true
        }
    })

    if (!userToken) throw Error()

    return userToken.user
}

export default async function appRoutes(app: FastifyInstance) {
    app.post("/habits", async (request) => {
        const { email } = await getUserFromRequest(request)

        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf("day").add(dayjs().utcOffset(), 'minute').toDate()
        console.log(`Creating habit '${title}' at (${today.toISOString()}) for user id='${email}'`)

        const habit = await prisma.habit.create({
            data: {
                title,
                createdAt: today,
                weekDays: {
                    create: weekDays.map(weekDay => ({ weekDay }))
                },
                userId: email
            }
        })
        return {
            id: habit.id
        }
    })

    app.get("/day", async (request) => {
        const { email } = await getUserFromRequest(request)

        const getDayQueryParams = z.object({
            date: z.coerce.date()
        })

        const date = dayjs(getDayQueryParams.parse(request.query).date).toDate()
        console.log(`Getting day: ${date.toISOString()} for user id='${email}'`)

        const possibleHabits = await prisma.habit.findMany({
            where: {
                createdAt: {
                    lte: date
                },
                weekDays: {
                    some: {
                        weekDay: {
                            equals: date.getUTCDay()
                        }
                    }
                },
                userId: email
            }

        })

        const day = await prisma.day.findUnique({
            where: {
                date_userId: {
                    date: date,
                    userId: email
                }
            },
            include: {
                dayHabits: true
            }
        })
        const completedHabits = day?.dayHabits.map(dayHabit => dayHabit.habitId) ?? []

        return {
            possibleHabits,
            completedHabits
        }

    })

    app.patch("/habits/:habitId/toggle", async (request) => {
        const { email } = await getUserFromRequest(request)

        const toggleHabitParams = z.object({
            habitId: z.string().uuid(),
        })

        const { habitId } = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf("day").add(dayjs().utcOffset(), 'minute').toDate()
        console.log(`Toggling habit id='${habitId}' at (${today.toISOString()}) for user id='${email}'`)

        let day = await prisma.day.findUnique({
            where: {
                date_userId: {
                    date: today,
                    userId: email
                }
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today,
                    userId: email,
                }
            })
        }

        let dayHabit = await prisma.dayHabit.findUnique({
            where: {
                dayId_habitId: {
                    dayId: day.id,
                    habitId: habitId,
                }
            }
        })
        let status = true;
        if (dayHabit) {
            dayHabit = await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            })
            status = false
        } else {
            dayHabit = await prisma.dayHabit.create({
                data: {
                    dayId: day.id,
                    habitId: habitId,
                }
            })
        }
        return {
            status,
            dayHabit
        }

    })

    app.get("/summary", async (request, response) => {
        const user = await getUserFromRequest(request)

        if (!user) {
            response.statusCode = 401
            return {
                error: "Unauthorized",
                message: "Token de sessão inválido",
                statusCode: 401,
            }
        }

        const userId = user.email
        console.log(`Gettin summary for ${userId}`)

        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.dayId = D.id
                ) as completed,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habitId
                    WHERE 
                        HWD.weekDay = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int) 
                        AND H.createdAt <= D.date
                        AND H.userId = ${userId}
                ) as possible
            FROM days D
            WHERE 
                D.userId = ${userId}

        `

        return summary
    })

    app.post("/users", async (request) => {
        const createUserBody = z.object({
            email: z.string(),
            name: z.string(),
            password: z.string(),
        })

        const { email, name, password } = createUserBody.parse(request.body)

        console.log(`Creating user '${name}'`)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            }
        })
        return user
    })

    app.post("/login", async (request, response) => {
        const getUserBody = z.object({
            email: z.string(),
            password: z.string(),
        })

        const { email, password } = getUserBody.parse(request.body)

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
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

        let token;
        try {
            token = await prisma.token.create({
                data: {
                    userEmail: email
                },
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                token = await prisma.token.findUnique({
                    where: {
                        userEmail: email
                    }
                })
            } else { throw e }
        }
        return {
            message: "Login bem sucedido",
            statusCode: 200,
            token: token!.id,
        }
    })

    app.post("/register", async (request, response) => {
        const getUserBody = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),
        })

        const { email } = getUserBody.parse(request.body)

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (user) {
            response.statusCode = 400
            return {
                error: "Bad Request",
                message: "Usuário Já Existe",
                statusCode: 400,
            }
        }

        await prisma.user.create({
            data: getUserBody.parse(request.body)
        })

        return {
            message: "Registro bem sucedido",
            statusCode: 200,
        }
    })

    app.delete("/dev/weekDay", async (request, response) => {
        const { email } = await getUserFromRequest(request)
        if (email != "rasealca2017@gmail.com") {
            response.statusCode = 401
            return {
                error: "Unauthorized",
                message: "Somente o administrador pode fazer essa operação",
                statusCode: 401,
            }
        }

        const toggleHabitParams = z.object({
            IDs: z.array(z.string()),
        })

        const { IDs } = toggleHabitParams.parse(request.body)

        await prisma.habitWeekDays.deleteMany({
            where: {
                id: {
                    in: IDs,
                }
            }
        })
    })

    app.delete("/dev/habit", async (request, response) => {
        const { email } = await getUserFromRequest(request)
        if (email != "rasealca2017@gmail.com") {
            response.statusCode = 401
            return {
                error: "Unauthorized",
                message: "Somente o administrador pode fazer essa operação",
                statusCode: 401,
            }
        }

        const toggleHabitParams = z.object({
            IDs: z.array(z.string()),
        })

        const { IDs } = toggleHabitParams.parse(request.body)

        await prisma.habitWeekDays.deleteMany({
            where: {
                habitId: {
                    in: IDs,
                }
            }
        })
        await prisma.habit.deleteMany({
            where: {
                id: {
                    in: IDs,
                }
            }
        })
    })

    app.get("/dev", async (request, response) => {
        const { email } = await getUserFromRequest(request)
        if (email != "rasealca2017@gmail.com") {
            response.statusCode = 401
            return {
                error: "Unauthorized",
                message: "Somente o administrador pode fazer essa operação",
                statusCode: 401,
            }
        }


        return await prisma.user.findMany({
            include: {
                Day: {
                    include: {
                        dayHabits: true
                    }
                },
                Habit: {
                    include: {
                        weekDays: true
                    }
                },
                Token: true,
            }
        })

    })
}
