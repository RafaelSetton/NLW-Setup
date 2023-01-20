import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const firstHabitCreationDate = new Date('2022-12-31')

const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const secondHabitCreationDate = new Date('2023-01-03')

const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const thirdHabitCreationDate = new Date('2023-01-08')

async function run() {
    await prisma.dayHabit.deleteMany();
    await prisma.habitWeekDays.deleteMany();
    await prisma.day.deleteMany();
    await prisma.habit.deleteMany();

    /**
     * Create habits
     */
    await Promise.all([
        prisma.habit.create({
            data: {
                id: firstHabitId,
                title: 'Beber 2L água',
                createdAt: firstHabitCreationDate,
                weekDays: {
                    create: [
                        { weekDay: 1 },
                        { weekDay: 2 },
                        { weekDay: 3 },
                    ]
                }
            }
        }),

        prisma.habit.create({
            data: {
                id: secondHabitId,
                title: 'Exercitar',
                createdAt: secondHabitCreationDate,
                weekDays: {
                    create: [
                        { weekDay: 3 },
                        { weekDay: 4 },
                        { weekDay: 5 },
                    ]
                }
            }
        }),

        prisma.habit.create({
            data: {
                id: thirdHabitId,
                title: 'Dormir 8h',
                createdAt: thirdHabitCreationDate,
                weekDays: {
                    create: [
                        { weekDay: 1 },
                        { weekDay: 2 },
                        { weekDay: 3 },
                        { weekDay: 4 },
                        { weekDay: 5 },
                    ]
                }
            }
        })
    ])

    await Promise.all([
        /**
         * Habits (Complete/Available): 1/1
         */
        prisma.day.create({
            data: {
                /** Monday */
                date: new Date('2023-01-02'),
                dayHabits: {
                    create: {
                        habitId: firstHabitId,
                    }
                }
            }
        }),

        /**
         * Habits (Complete/Available): 1/1
         */
        prisma.day.create({
            data: {
                /** Friday */
                date: new Date('2023-01-06'),
                dayHabits: {
                    create: {
                        habitId: firstHabitId,
                    }
                }
            }
        }),

        /**
         * Habits (Complete/Available): 2/2
         */
        prisma.day.create({
            data: {
                /** Wednesday */
                date: new Date('2023-01-04'),
                dayHabits: {
                    create: [
                        { habitId: firstHabitId },
                        { habitId: secondHabitId },
                    ]
                }
            }
        }),
    ])
}

run()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })