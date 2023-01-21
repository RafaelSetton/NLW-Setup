import { View, TouchableOpacity, Text, TouchableOpacityProps } from "react-native"
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'


interface CheckBoxProps extends TouchableOpacityProps {
    checked?: boolean
    title: String
}

export default function CheckBox({ checked = false, title, ...touchable }: CheckBoxProps) {

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row mb-2 items-center"
            {...touchable}
        >
            {
                checked ?
                    <View
                        className='h-8 w-8 bg-green-500 rounded-lg items-center justify-center'
                    >
                        <Feather
                            name="check"
                            size={20}
                            color={colors.white}
                        />

                    </View>
                    :
                    <View className="h-8 w-8 bg-zinc-900 rounded-lg" />
            }
            <Text
                className="text-white text-bas ml-3 font-semibold"
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}