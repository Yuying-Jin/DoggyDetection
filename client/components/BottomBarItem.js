import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import {useTheme} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const BottomBarItem = ({iconName, text, handlePress, routeName}) => {
    const theme = useTheme();
    const active = text.replace(' ','') === routeName.replace(/_\w*/g, '') ? theme.colors.primary :theme.colors.inversePrimary

    return (
        <TouchableOpacity onPress={handlePress}>
            <>
                <MaterialCommunityIcons name={iconName} size={25} style={{...styles.fontStyle, color: active}}/>
                <Text style = {{...styles.iconText, color: theme.colors.onBackground}}>{text}</Text>
            </>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fontStyle: {marginBottom:3, alignSelf:"center"},
    iconText: {fontSize: 12, textAlign: 'center'},
})
