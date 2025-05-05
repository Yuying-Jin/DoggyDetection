import {Dimensions, StyleSheet, View} from 'react-native';
import {BottomBarItem} from "./BottomBarItem";
import {useNavigation, useRoute} from "@react-navigation/native";
import {PaperProvider, useTheme} from "react-native-paper";

const screenWidth = Dimensions.get('window').width;

export const BottomBar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const theme = useTheme()

    return (

        <View style={{width: screenWidth, backgroundColor: theme.colors.surfaceVariant}} >
            <View  style={{...styles.container}}>
                <BottomBarItem text={"Field Guide"} iconName={"book"} handlePress={()=>navigation.navigate("FieldGuide")} routeName={route.name}/>
                <BottomBarItem text={"Camera"} iconName={"camera"} handlePress={()=>navigation.navigate("Camera")} routeName={route.name}/>
                <BottomBarItem text={"Settings"} iconName={"cog-outline"} handlePress={()=>navigation.navigate("Settings")} routeName={route.name}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginHorizontal: 30,
        justifyContent: "space-between",
        paddingVertical: 10,
    },
})
