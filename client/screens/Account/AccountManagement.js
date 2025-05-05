import React, {useContext, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import {
    List,
    TouchableRipple, Divider, Switch, useTheme
} from 'react-native-paper';
import {AuthContext} from "../../context/auth";
import {NORMAL_TEXT_SIZE, SCREEN_PADDING, TOUCHABLE_Ripple_PADDING} from "../../Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AccountManagement = ({navigation}) => {
    const [auth, setAuth] = useContext(AuthContext)
    const isLogin = auth && auth.token !== "" && auth.user !== null
    const theme = useTheme();

    const [isDarkMode, setIsDarkMode] = useState(false);

    const logout = async () => {
        setAuth({token: "", user: null})
        await  AsyncStorage.removeItem("auth-rn")
    }

    return (
            <View style={{...styles.container, backgroundColor: theme.colors.background}}>
                <List.Section>
                    <TouchableRipple
                        onPress={() => navigation.navigate('Reset Password')}>
                        <List.Item
                            style={styles.listItem}
                            title="Reset Passward"
                            left={() => (
                                <List.Icon
                                    icon="lock-reset"
                                    color={theme.colors.primary}/>
                            )}
                            right={() => (
                                <List.Icon
                                    icon='chevron-right'
                                    color={theme.colors.primary}
                                    style={{marginRight: 10}}/>
                            )}/>
                    </TouchableRipple>
                    <Divider />
                    <TouchableRipple
                        onPress={() => navigation.navigate('Update Email')}>
                        <List.Item
                            style={styles.listItem}
                            title="Update Email"
                            left={() => (
                                <List.Icon
                                    icon="email-sync-outline"
                                    color={theme.colors.primary}/>
                            )}
                            right={() => (
                                <List.Icon
                                    icon='chevron-right'
                                    color={theme.colors.primary}
                                    style={{marginRight: 10}}/>
                            )}/>
                    </TouchableRipple>
                    <Divider />

                    <TouchableRipple
                        onPress={logout}>
                        <List.Item
                            style={styles.listItem}
                            title="Log Out"
                            left={() => (
                                <List.Icon
                                    icon="logout-variant"
                                    color={theme.colors.primary}/>
                            )}
                        />
                    </TouchableRipple>
                    <Divider />
                </List.Section>
            </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: SCREEN_PADDING,
        paddingRight: SCREEN_PADDING
    },
    listItem: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: TOUCHABLE_Ripple_PADDING,
        paddingRight: TOUCHABLE_Ripple_PADDING,
    },
    text: {
        includeFontPadding: false,
        fontSize: NORMAL_TEXT_SIZE,
    },
});
