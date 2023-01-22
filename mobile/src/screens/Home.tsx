import { View, Text, ScrollView, Alert } from 'react-native'
import DayTile, { DAY_SIZE } from '../components/DayTile'
import Header from '../components/Header'
import generateDateRange from '../utils/generateDateRange'
import api from '../lib/axios'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import Loading from '../components/Loading'

const dates = generateDateRange()

const minimumDaysLoaded = 10 * 7
const daysToLoad = minimumDaysLoaded - dates.length

type Summary = Array<{
    id: string;
    date: string;
    possible: number;
    completed: number;
}>

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<Summary>([])

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get("/summary")
            console.log(response.data)
            setSummary(response.data)
        }
        catch (err) {
            Alert.alert("Ops", "Algo não ocorreu como esperado")
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return loading ? <Loading /> : (
        <View className='flex-1 bg-background px-8 pt-16'>
            <Header />
            <View
                className='flex-row mt-6 mb-2'
            >
                {
                    "DSTQQSS".split("").map((weekDay, i) => (
                        <Text
                            key={`${weekDay}-${i}`}
                            className='text-zinc-400 text-xl font-bold text-center mx-1'
                            style={{ width: DAY_SIZE }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View
                    className='flex-row flex-wrap'
                >
                    {
                        dates.map(
                            date => {
                                const dayInSummary = summary.find(d => dayjs(date).isSame(d.date, 'day'))
                                return (
                                    <DayTile
                                        key={date.toISOString()}
                                        date={date}
                                        completed={dayInSummary?.completed}
                                        possible={dayInSummary?.possible}
                                    />
                                )
                            }
                        )
                    }
                    {
                        Array.from({ length: daysToLoad }).map(
                            (_, i) => (
                                <View key={i}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                />
                            )
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}