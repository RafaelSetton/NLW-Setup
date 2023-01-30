import dayjs from "dayjs";
import { DocumentReference, DocumentSnapshot } from "firebase-admin/firestore";
import UserModel from "../models/User";
import { db } from "../lib/firebase";

export function getData(doc: DocumentSnapshot): UserModel {
    const data = doc.data()!

    return {
        email: data.email,
        name: data.name,
        token: data.token,
        password: data.password,

        habits: data.habits.map((h: { title: string; createdAt: string | number | Date | dayjs.Dayjs; weekDays: number[]; id: string; }) => {
            return {
                id: h.id,
                title: h.title,
                createdAt: dayjs(h.createdAt),
                weekDays: h.weekDays,
            }
        }),
        days: data.days.map((d: { date: string | number | Date | dayjs.Dayjs; completed: string[]; }) => {
            return {
                date: dayjs(d.date),
                completed: d.completed,
            }
        }),
    }
}

export function getUserDoc(email: string): DocumentReference {
    return db.collection("users").doc(email)
}

export default async function getUserData(email: string): Promise<UserModel> {
    return getData(await getUserDoc(email).get())
}