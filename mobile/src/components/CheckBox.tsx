import { View, TouchableOpacity, Text, TouchableOpacityProps } from "react-native"
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import clsx from "clsx"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"


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
                    <Animated.View
                        className='h-8 w-8 bg-green-500 rounded-lg items-center justify-center'
                        entering={ZoomIn}
                        exiting={ZoomOut}
                    >
                        <Feather
                            name="check"
                            size={20}
                            color={colors.white}
                        />

                    </Animated.View>
                    :
                    <View className="h-8 w-8 bg-zinc-900 rounded-lg" />
            }
            <Text
                className={clsx("text-base ml-3 font-semibold", {
                    "text-white": !checked,
                    "line-through text-zinc-400": checked
                })}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}