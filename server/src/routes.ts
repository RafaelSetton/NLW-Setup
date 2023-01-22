import dayjs from "dayjs"
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { prisma } from "./lib/prisma"

export default async function appRoutes(app: FastifyInstance) {
    app.post("/habits", async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf("day").add(dayjs().utcOffset(), 'minute').toDate()
        console.log(`Creating habit '${title}' at (${today.toISOString()})`)

        const habit = await prisma.habit.create({
            data: {
                title,
                createdAt: today,
                weekDays: {
                    create: weekDays.map(weekDay => ({ weekDay }))
                }
            }
        })
        return {
            id: habit.id
        }
    })

    app.get("/day", async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const date = dayjs(getDayParams.parse(request.query).date).toDate()
        console.log(`Getting day: ${date.toISOString()}`)
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
                }
            }

        })

        const day = await prisma.day.findUnique({
            where: {
                date: date
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

    app.patch("/habits/:id/toggle", async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf("day").add(dayjs().utcOffset(), 'minute').toDate()
        console.log(`Toggling habit id='${id}' at (${today.toISOString()})`)

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            })
        }

        let dayHabit = await prisma.dayHabit.findUnique({
            where: {
                dayId_habitId: {
                    dayId: day.id,
                    habitId: id,
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
                    habitId: id,
                }
            })
        }
        return {
            status,
            dayHabit
        }
    })

    app.get("/summary", async () => {
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
                ) as possible
            FROM days D

        `

        return summary
    })
}