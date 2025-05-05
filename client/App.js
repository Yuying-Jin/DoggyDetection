import { StyleSheet } from 'react-native';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import Toast from "react-native-toast-message";
import {AuthProvider} from "./context/auth";
import {LinkProvider} from "./context/link";
import NavigationScreen from "./screens/NavigationScreen";
import {DarkTheme, NavigationContainer} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";

import {isDarkModeAtom} from "./store";
import {useAtom} from "jotai";
import {darkTheme, lightTheme} from "./theme";

export default function App() {
    const [isDark] = useAtom(isDarkModeAtom);
    // ---------------------for debugging----------------------
                        // useEffect( () => {
                        //     const clearAsyncStorage = async () => {
                        //         try {
                        //             const existingResults = await AsyncStorage.getItem('detectionResult');
                        //             if (existingResults) {
                        //                 await AsyncStorage.removeItem('detectionResult');
                        //                 console.log('AsyncStorage cleared successfully');
                        //             }
                        //         } catch (error) {
                        //             console.error('Error clearing AsyncStorage:', error);
                        //         }
                        //     };
                        //     clearAsyncStorage()
                        // }, []);


    // -----------------------------------------------------------

    return (
        <PaperProvider theme={isDark ? darkTheme : lightTheme}>
            <NavigationContainer style={styles.container} >
                  <AuthProvider>
                      <LinkProvider>
                            <NavigationScreen/>
                          <Toast refs={(ref) => Toast.setRef(ref)} />
                      </LinkProvider>
                  </AuthProvider>
            </NavigationContainer>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },
});
