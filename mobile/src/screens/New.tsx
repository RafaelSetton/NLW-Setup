import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import BackButton from '../components/BackButton'
import CheckBox from '../components/CheckBox'
import { FormEvent, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import api from '../lib/axios'

const weekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
]

export default function NewHabit() {
    const [title, setTitle] = useState('')
    const [weekDaysState, setWeekDaysState] = useState<boolean[]>(Array(7).fill(false))

    function handleToggleWeekDay(index: number) {
        var copy = weekDaysState.slice()
        copy[index] = !copy[index]
        setWeekDaysState(copy)
    }

    function handleCreateNewHabit() {
        try {
            const parsedWeekDays = weekDaysState.map((wd, i) => wd ? i : null).filter(el => el !== null)

            if (!title.trim())
                return Alert.alert("Novo Hábito", "Informe um nome para o hábito")
            if (parsedWeekDays.length == 0)
                return Alert.alert("Novo Hábito", "Selecione pelo menos um dia da semana")

            api.post("/habits", {
                title,
                weekDays: parsedWeekDays,
            })

            setTitle('')
            setWeekDaysState(Array(7).fill(false))

            Alert.alert("Hábito criado com sucesso")

        } catch (err) {
            console.log(err)
            Alert.alert("Ops", "Não foi possível criar o hábito")
        }
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 75 }}
            >

                <BackButton />
                <Text className='mt-6 text-white font-extrabold text-3xl'>
                    Criar Hábito
                </Text>
                <Text className='mt-6 text-white font-semibold text-base'>
                    Qual seu comprometimento?
                </Text>
                <TextInput
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder='Ex. Academia, Beber água, etc.'
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />

                <Text className='font-semibold mt-4 mb-3 text-white text-base' >
                    Qual a recorrência?
                </Text>

                {
                    weekDays.map((day, i) => (
                        <CheckBox
                            key={day}
                            title={day}
                            checked={weekDaysState[i]}
                            onPress={() => handleToggleWeekDay(i)}
                        />
                    ))
                }

                <TouchableOpacity
                    className='flex-row bg-green-600 rounded-md items-center justify-center h-14 w-full'
                    activeOpacity={0.7}
                    onPress={() => handleCreateNewHabit()}
                >
                    <Feather
                        name='check'
                        size={20}
                        color={colors.white}
                    />
                    <Text
                        className='font-semibold text-base text-2hite ml-2 '
                    >
                        Criar
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}