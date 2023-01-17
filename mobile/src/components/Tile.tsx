import { ColorValue, View, StyleSheet } from "react-native";

interface TileProps {
    completion: 0 | 1 | 2 | 3 | 4 | 5
}

export default function Tile(props: TileProps) {
    const colors: ColorValue[] = [
        "#333",
        "#536",
        "#738",
        "#93a",
        "#b3d",
        "#d3f",
    ];

    const style = StyleSheet.create({
        tile: {
            backgroundColor: colors[props.completion],
            borderRadius: 10,
            width: 30,
            height: 30,
            margin: 1,
        }

    })
    return (
        <View style={style.tile} >

        </View>
    );
}