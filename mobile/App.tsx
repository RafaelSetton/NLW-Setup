import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from "@expo-google-fonts/inter"

import Loading from './src/components/Loading';
import Tile from './src/components/Tile';


export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold })

  if (!fontsLoaded) return (
    <Loading />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Open up App.tsx to start working on your app!</Text>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Tile completion={1} />
      <Tile completion={3} />
      <Tile completion={2} />
      <Tile completion={5} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: "blue",
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 25,
    marginTop: 15,
  }
});
