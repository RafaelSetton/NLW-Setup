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

        const today = dayjs().startOf("day").toDate()
        today.setUTCHours(0)

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
        const completedHabits = day?.dayHabits.map(dayHabit => dayHabit.habitId)

        return {
            possibleHabits,
            completedHabits
        }

    })
}