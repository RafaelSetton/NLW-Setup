import { TouchableOpacity, Dimensions, Text } from "react-native";
import { useNavigation } from "@react-navigation/native"
import progressPercentage from "../utils/progressPercentage";
import clsx from "clsx";
import dayjs from 'dayjs'

interface DayTileProps {
    completed?: number
    possible?: number
    date: Date
}

const SCREEN_HORIZONTAL_PADDING = 32 * 2 / 5
export const DAY_MARGIN_BETWEEN = 8
export const DAY_SIZE = (Dimensions.get("screen").width / 7) - (SCREEN_HORIZONTAL_PADDING + 5)

export default function DayTile({ date, completed = 0, possible = 0 }: DayTileProps) {
    const { navigate } = useNavigation()

    const completedPercentage = progressPercentage(completed, possible)

    return (
        <TouchableOpacity

            className={clsx(
                "rounded-lg border-2 m-1", {
                ["bg-zinc-900 border-zinc-800"]: completedPercentage === 0,
                ["bg-violet-900 border-violet-700"]: completedPercentage > 0 && completedPercentage < 20,
                ["bg-violet-800 border-violet-600"]: completedPercentage >= 20 && completedPercentage < 40,
                ["bg-violet-700 border-violet-500"]: completedPercentage >= 40 && completedPercentage < 60,
                ["bg-violet-600 border-violet-500"]: completedPercentage >= 60 && completedPercentage < 80,
                ["bg-violet-500 border-violet-400"]: completedPercentage >= 80,
                ["border-zinc-400 border-4"]: dayjs().startOf("day").isSame(date),
            }
            )}
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            activeOpacity={0.7}
            onPress={() => navigate("day", { date: date.toISOString() })}
        />
    );
}