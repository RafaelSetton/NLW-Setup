import { View, Text, ScrollView } from 'react-native'
import DayTile, { DAY_SIZE } from '../components/DayTile'
import Header from '../components/Header'
import generateDateRange from '../utils/generateDateRange'

const dates = generateDateRange()

const minimumDaysLoaded = 10 * 7
const daysToLoad = minimumDaysLoaded - dates.length

export default function Home() {
    return (
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
                            date => (
                                <DayTile
                                    key={date.toISOString()}
                                />
                            )
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