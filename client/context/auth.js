import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: '',
        token: ''
    });

    // navigation
    const navigation = useNavigation();

    // config axios
    const token = state && state.token ? state.token : "";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // handle expired token or 401 error
    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        async function (error) {
            if (error.response && error.response.status === 401) {
                try {
                    await AsyncStorage.removeItem("auth-rn");
                    setState({ user: null, token: "" });
                    navigation.navigate("Login");
                } catch (e) {
                    console.error("Error removing auth-rn from AsyncStorage:", e);
                }
            }
            return Promise.reject(error);
        }
    );


    useEffect(() => {
        const loadFromAsyncStorage = async() => {
            let data = await AsyncStorage.getItem('auth-rn');
            const parsed = JSON.parse(data);
            setState({
                user: parsed.user || null,
                token: parsed.token || null,
            });
        }
        loadFromAsyncStorage().then(result => {
            console.log(result)
        })
        .catch(error => {
            console.log(error)
        });
    },[])

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    )
}

