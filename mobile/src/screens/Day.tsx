import { ScrollView, View, Text } from 'react-native'
import { useRoute } from "@react-navigation/native"
import BackButton from '../components/BackButton'
import dayjs from 'dayjs'
import ProgressBar from '../components/ProgressBar'
import CheckBox from '../components/CheckBox'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import api from '../lib/axios'
import progressPercentage from '../utils/progressPercentage'
import HabitsEmpty from '../components/HabitsEmpty'
import clsx from 'clsx'

interface DayParams {
    date: string
}

interface HabitsInfo {
    possibleHabits: Array<{
        id: string
        title: string
        createdAt: string
    }>
    completedHabits: String[]
}

export default function Day() {
    const route = useRoute()
    const { date } = route.params as DayParams

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<HabitsInfo>({ possibleHabits: [], completedHabits: [] })

    const parsedDate = dayjs(date)
    const dayOfWeek = parsedDate.subtract(parsedDate.utcOffset(), 'minutes').format("dddd")
    const dayAndMonth = parsedDate.subtract(parsedDate.utcOffset(), 'minutes').format("DD/MM")

    const isPast = parsedDate.isBefore(dayjs().subtract(1, 'day'))

    useEffect(() => {

        setLoading(true)

        api.get("/day", {
            params: {
                date: parsedDate.toString()
            }
        }).then(res => setData(res.data)).then(() => setLoading(false))

    }, [])

    function handleToggleHabit(habitId: string) {
        api.patch(`/habits/${habitId}/toggle`)

        var newCompleted = data.completedHabits
        if (newCompleted.includes(habitId))
            newCompleted = newCompleted.filter(id => id != habitId)
        else
            newCompleted.push(habitId)
        setData({
            possibleHabits: data.possibleHabits,
            completedHabits: newCompleted,
        })
    }

    return loading ? <Loading /> : (
        <View className='flex-1 bg-background px-8 pt-16'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className='mt-6 text-zinc-400 font-semibold text-base lowercase'>
                    {dayOfWeek}
                </Text>
                <Text className='mt-6 text-white font-extrabold text-3xl'>
                    {dayAndMonth}
                </Text>
                <ProgressBar progress={progressPercentage(data.completedHabits.length, data.possibleHabits.length)} />

                <View className={clsx('mt-6', {
                    'opacity-50': isPast
                })}>
                    {
                        data.possibleHabits.length
                            ? data.possibleHabits.map(habit => (
                                <CheckBox
                                    key={habit.id}
                                    onPress={() => handleToggleHabit(habit.id)}
                                    disabled={isPast}
                                    title={habit.title}
                                    checked={data.completedHabits.includes(habit.id)}
                                />
                            ))
                            : <HabitsEmpty />
                    }
                </View>
                {
                    isPast && (
                        <Text className='text-white mt-10 text-center'>
                            Você não pode editar hábitos de uma data passada
                        </Text>
                    )
                }

            </ScrollView>
        </View>
    )
}