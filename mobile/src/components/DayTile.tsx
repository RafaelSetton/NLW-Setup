import { TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native"

interface DayTileProps {
    //completion: 0 | 1 | 2 | 3 | 4 | 5
    date: String
}

const SCREEN_HORIZONTAL_PADDING = 32 * 2 / 5
export const DAY_MARGIN_BETWEEN = 8
export const DAY_SIZE = (Dimensions.get("screen").width / 7) - (SCREEN_HORIZONTAL_PADDING + 5)

export default function DayTile({ date }: DayTileProps) {
    const { navigate } = useNavigation()

    return (
        <TouchableOpacity
            className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            activeOpacity={0.7}
            onPress={() => navigate("day", { date })}
        />
    );
}