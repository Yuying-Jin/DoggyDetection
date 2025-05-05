import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, View, Image,Text } from 'react-native';
import {
    TouchableRipple,
    Switch,
    useTheme,
    List,
    Divider,
    PaperProvider,
    Icon,
} from 'react-native-paper';
import {IP, NORMAL_TEXT_SIZE, SCREEN_PADDING, TOUCHABLE_Ripple_PADDING} from '../Constants';
import {BottomBar} from "../components/BottomBar";
import {AuthContext} from "../context/auth";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {useAtom} from "jotai";
import {isDarkModeAtom} from "../store";
import {darkTheme, lightTheme} from "../theme";

export const SettingScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const theme = useTheme();
    const [auth, setAuth] = useContext(AuthContext);
    const authenticated = auth && auth.token !== "" && auth.user !== null;
    const [isDark, setIsDark] = useAtom(isDarkModeAtom);

    const [profilePhoto, setProfilePhoto] = useState({ url: "", public_id: "" });

    const [registrationDate, setRegistrationDate] = useState(new Date());
    const [registeredDays, setRegisteredDays] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth?.user) {
                const authStorage = await AsyncStorage.getItem('auth-rn');
                const authJSON = JSON.parse(authStorage);
                setAuth(authJSON.user)
                setRegistrationDate(Date(authJSON.user.createdAt));
                // Calculate the registered days
                const currentDate = new Date();
                const timeDifference = currentDate.getTime() - registrationDate.getTime();
                const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
                setRegisteredDays(Math.floor(daysDifference));
            }
        };
        // Call the async function
        fetchUserData().then(r => console.log("register days: ", r));
    }, [auth?.user]);


    const handleUpload = async () => {
        // let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (permissionResult.granted === false) {
        //     alert("Camera access is required");
        //     return;
        // }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            base64: true,
        });
        if (result.canceled) {
            return;
        }
        let storedData = await AsyncStorage.getItem("auth-rn");

        const parsed = JSON.parse(storedData);
        const { data } = await axios.post(`http://${IP}:8080/api/upload-image`, {
            user: parsed.user,
            profile_photo: result.assets[0].base64,
        });
        console.log("UPLOADED RESPONSE => ", data);
        const stored = JSON.parse(await AsyncStorage.getItem("auth-rn"));
        stored.user.profilePhoto = data;
        await AsyncStorage.setItem("auth-rn", JSON.stringify(stored));
        setAuth({...auth, user: data });
        setProfilePhoto(data.profile_photo);
        alert("Profile image saved");
    };
    const accountManageScreen = authenticated ? "Account Management" : "Login"
    return (
        <PaperProvider theme={isDark ? darkTheme : lightTheme}>
            <View style={{...styles.container, backgroundColor: theme.colors.background}}>
                <List.Section>
                    {authenticated ?
                        <View style={{...styles.userContainer, borderColor: colors.primary}}>
                            <TouchableRipple onPress={handleUpload} style={styles.iconContainer}>
                                {auth.profile_photo && auth.profile_photo.url !== "" ?
                                    <Image source={{ uri: auth.profile_photo.url }} style={{...styles.imageStyles, borderColor: colors.primary}} />
                                    :
                                    <Icon size={50} source="camera" color="grey" style={styles.imageStyles}/>
                                }
                            </TouchableRipple>
                            <View style={styles.userInfo}>
                                <Text style={{...styles.username, color: theme.colors.onBackground}}>{auth.username}</Text>
                                <Text style={styles.userDays}>Registered for {registeredDays.toLocaleString()} {registeredDays < 2 ? 'day' : 'days'}</Text>
                            </View>
                        </View>
                        : null
                    }
                    <List.Subheader>General</List.Subheader>
                    <TouchableRipple
                        onPress={() => navigation.navigate(accountManageScreen)}>
                        <List.Item
                            style={styles.listItem}
                            title={accountManageScreen}
                            description={authenticated ? "Manage your account settings" : "Login or register an account"}
                            left={() => (
                                <List.Icon
                                    icon="account"
                                    color={colors.primary}/>
                            )}
                            right={() => (
                                <List.Icon
                                    icon='chevron-right'
                                    color={colors.primary}
                                    style={{marginRight: 10}}/>
                            )}/>
                    </TouchableRipple>
                    <Divider />
                    <List.Item
                        style={styles.listItem}
                        title="Dark Mode"
                        description="Toggle dark or light mode"
                        left={() => (
                            <List.Icon
                                icon={isDark ? 'weather-night' : 'white-balance-sunny'}
                                color={colors.primary}/>
                        )}
                        right={() => (
                            <Switch
                                value={isDark}
                                onValueChange={() => setIsDark((prev) => !prev)}/>
                        )}/>
                </List.Section>
                <Divider />
                <List.Section>
                    <List.Subheader>About</List.Subheader>
                        <List.Item
                            style={styles.listItem}
                            title="App Version: 1.0.0"
                            description="View app version information"
                            left={() => (
                                <List.Icon
                                    icon="information-outline"
                                    color={colors.primary}/>)}/>
                </List.Section>
            </View>
            <BottomBar/>
        </PaperProvider>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: SCREEN_PADDING,
    },

    listItem: {
        paddingVertical: 4,
        paddingHorizontal: TOUCHABLE_Ripple_PADDING,
    },
    text: {
        includeFontPadding: false,
        fontSize: NORMAL_TEXT_SIZE,
    },

    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyles: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
    },
    username: {
        fontSize: 24,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: TOUCHABLE_Ripple_PADDING,
        paddingVertical: 6,
        borderLeftWidth: 2,
    },
    userInfo: {
        marginLeft: 10,
    },
    userDays: {
        fontSize: 12.5,
        color: 'grey',
    },
});