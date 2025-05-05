import {CardStyleInterpolators, createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {CameraScreen} from "./CameraScreen";
import {FieldGuideConformedScreen} from "./FieldGuideConformedScreen";
import {SettingScreen} from "./SettingScreen";
import {Login} from "./Account/Login";
import {Register} from "./Account/Register";
import {ResetPassword} from "./Account/ResetPassword";
import {AccountManagement} from "./Account/AccountManagement";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {FieldGuideNotConformedScreen} from "./FieldGuideNotConformedScreen";
import {BottomBar} from "../components/BottomBar";
import {AuthContext} from "../context/auth";
import {useContext} from "react";
import {UpdateEmail} from "./Account/UpdateEmail";
import {PaperProvider, useTheme} from "react-native-paper";
import {HEADER_H, NORMAL_TEXT_SIZE} from "../Constants";

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function FieldGuide(){
    const theme = useTheme()

    return(
        <>
            <TopTab.Navigator initialRouteName='Illustared Book' >
                <TopTab.Screen name='FieldGuideConfirmed' component={FieldGuideConformedScreen}
                               options={{tabBarLabel: 'Confirmed',
                                   tabBarStyle: {backgroundColor: theme.colors.surfaceVariant},
                                   tabBarIndicatorStyle:{borderColor: theme.colors.primary, borderWidth: 1 },
                                   tabBarActiveTintColor: theme.colors.primary,
                                   tabBarInactiveTintColor: theme.colors.inversePrimary,
                               }}/>
                <TopTab.Screen name='FieldGuideNotComfirmed' component={FieldGuideNotConformedScreen}
                               options={{tabBarLabel: 'Not Confirmed',
                                   tabBarStyle: {backgroundColor: theme.colors.surfaceVariant,},
                                   tabBarIndicatorStyle:{borderColor: theme.colors.primary, borderWidth: 1 },
                                   tabBarActiveTintColor: theme.colors.primary,
                                   tabBarInactiveTintColor: theme.colors.inversePrimary,}}/>
            </TopTab.Navigator>
            <BottomBar/>
        </>
    )
}

export default function NavigationScreen() {
    const cameraIn = {
        ...TransitionPresets.ModalSlideFromBottomIOS,
        gestureDirection: 'vertical',
    };
    const [auth] = useContext(AuthContext)
    const isLogin = auth && auth.token !== "" && auth.user !== null
    const theme = useTheme()

    return (
    <Stack.Navigator initialRouteName='Camera'>
        <Stack.Group>
              <Stack.Screen name="FieldGuide" component={FieldGuide}
                            options={{
                                tabBarLabel: 'Field Guide',
                                tabBarIcon: () => (
                                    <MaterialCommunityIcons name="book" color={colors.primary} size={26} />
                                ),
                                headerStyle: {backgroundColor: theme.colors.surface, height: HEADER_H},
                                headerTitleStyle: {color: theme.colors.onSurface, fontSize: NORMAL_TEXT_SIZE},
                                animationEnabled: false,
                                headerLeft: false
                            }}/>
              <Stack.Screen name="Camera" component={CameraScreen}
                            options={{
                                tabBarLabel: 'Camera',
                                tabBarIcon: () => (
                                    <MaterialCommunityIcons name="camera" color={colors.primary} size={26} />
                                ),
                                animationEnabled: true,
                                headerShown: false,
                                ...cameraIn,
                            }}/>
              <Stack.Screen name="Settings" component={SettingScreen}
                            options={{
                                tabBarLabel: 'Settings',
                                tabBarIcon: () => (
                                    <MaterialCommunityIcons name="cog-outline" color={colors.primary} size={26} />
                                ),
                                headerStyle: {backgroundColor: theme.colors.surface, height: HEADER_H},
                                headerTitleStyle: {color: theme.colors.onSurface, fontSize: NORMAL_TEXT_SIZE},
                                headerTintColor: theme.colors.surface,
                                animationEnabled: false,
                                headerLeft: false
                            }}/>
        </Stack.Group>
        <Stack.Group>
            {!isLogin ?
                <>
                    <Stack.Screen name="Login" component={Login}
                        options={{
                            headerStyle: {backgroundColor: theme.colors.surface, height: HEADER_H},
                            headerTitleStyle: {color: theme.colors.onSurface, fontSize: NORMAL_TEXT_SIZE},
                            headerTintColor: theme.colors.primary,
                        }}
                    />
                    <Stack.Screen name="Register" component={Register}
                          options={{
                              headerStyle: {backgroundColor: theme.colors.surface, height: HEADER_H},
                              headerTitleStyle: {color: theme.colors.onSurface, fontSize: NORMAL_TEXT_SIZE},
                              headerTintColor: theme.colors.primary,
                          }}
                    />
                </>:
                <>
                    <Stack.Screen name = "Account Management" component={AccountManagement}
                          options={{
                              headerStyle: {backgroundColor: theme.colors.surface, height: HEADER_H},
                              headerTitleStyle: {color: theme.colors.onSurface, fontSize: NORMAL_TEXT_SIZE},
                              headerTintColor: theme.colors.primary,
                          }}
                    />
                    <Stack.Screen name = "Update Email" component={UpdateEmail}
                          options={{
                              headerStyle: {backgroundColor: theme.colors.surface, height: HEADER_H},
                              headerTitleStyle: {color: theme.colors.onSurface, fontSize: NORMAL_TEXT_SIZE},
                              headerTintColor: theme.colors.primary,
                          }}
                    />
                </>
            }
                <Stack.Screen name="Reset Password" component={ResetPassword}
                      options={{
                          headerStyle: {backgroundColor: theme.colors.surface, height: HEADER_H},
                          headerTitleStyle: {color: theme.colors.onSurface, fontSize: NORMAL_TEXT_SIZE},
                          headerTintColor: theme.colors.primary,
                      }}/>
        </Stack.Group>
    </Stack.Navigator>
  );
}

