import { Dayjs } from "dayjs"

export default interface DayModel {
    date: Dayjs
    completed: string[]
}
