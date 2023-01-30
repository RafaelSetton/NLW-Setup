import HabitModel from "./Habit"
import DayModel from "./Day"

export default interface UserModel {
    email: string
    name: string
    token: string
    password: string

    habits: HabitModel[]
    days: DayModel[]
}