import { Dayjs } from "dayjs"

export default interface HabitModel {
    id: string
    title: string
    createdAt: Dayjs
    weekDays: number[]
}
