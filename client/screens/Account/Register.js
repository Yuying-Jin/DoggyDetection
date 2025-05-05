import React, {useContext, useState} from 'react';
import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, TextInput, Text, Icon, useTheme} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {IP, SCREEN_PADDING} from "../../Constants";
import axios from "axios";
import {AuthContext} from "../../context/auth";
import * as ImagePicker from "expo-image-picker";

const screenHeight = Dimensions.get('window').height;

export const Register = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [auth, setAuth] = useContext(AuthContext);
    const [profilePhoto, setProfilePhoto] = useState({ url: "", public_id: "" });
    const [base64Photo, setBase64Photo] = useState();

    const theme = useTheme()
    const handleConfirm = async() => {
        console.log("handle confirm")
        // check if all fields are filled
        if (!name || !email || !username || !password || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `Please fill in all fields.`,
            });
            return;
        }
        // check if passwords matched
        if (password !== confirmPassword){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `Passwords unmatched.`,
            });
            return null;
        }
        console.log("register profile photo:", profilePhoto)
        // post account information
        const resp = await  axios.post(`http://${IP}:8080/api/register`,
            {name, email, username, password, base64Photo})
        // display error message if failed
        if (resp?.data.error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: resp.data.error,
                visibilityTime: 2000,
                autoHide: true,
            });
        // register success
        }else{
            setAuth(resp.data)
            await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data))
            Toast.show({
                type: 'success',
                text1: 'Register success',
                text2: `Welcome, ${username}!`,
                visibilityTime: 2000,
                autoHide: true,
            });
            navigation.navigate('Login');
        }
    }

    const handleUpload = async () => {
        console.log("handle upload")
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Camera access is required");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            base64: true,
        });
        if (result.canceled) {
            return;
        }
        setProfilePhoto({url: result.assets[0].uri});
        setBase64Photo(`data:image/jpg;base64,${result.assets[0].base64}`);
    }


    const styles = StyleSheet.create({
        container: {
            height: screenHeight,
            backgroundColor: theme.colors.background,
            paddingLeft: SCREEN_PADDING,
            paddingRight: SCREEN_PADDING,
        },
        button:{
            marginTop:15,
            marginHorizontal:10,
        },
        imageContainer: {
            justifyContent: "center",
            alignItems: "center",
        },
        imageStyles: {
            width: 100,
            height: 100,
            marginVertical: 20,
            borderRadius: 50
        },
        iconContainer: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: 'lightgray',
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconStyle: {
            marginTop: -5, marginBottom: 10, alignSelf: "center"
        },
    });


    return (
      <KeyboardAwareScrollView behavior="padding" style={{flex: 1}}>
            <View style={styles.container}>
                <View style={{ marginVertical: 25 }}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={() => handleUpload()} style={styles.iconContainer}>
                        {profilePhoto?.url ? <Image source={{ uri: profilePhoto.url }} style={styles.imageStyles}  />
                            : (
                                <Icon size={50} source="camera" color="grey"/>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <TextInput label="Name" value={name} onChangeText={setName} />
                <TextInput label="Email" value={email} onChangeText={setEmail}
                           autoComplete="email"/>
                <TextInput label="Username" value={username} onChangeText={setUsername} />
                <TextInput
                    label="Password"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    right={
                    <TextInput.Icon
                          icon={passwordVisible ? 'eye' : 'eye-off-outline'}
                          onPress={() => setPasswordVisible(!passwordVisible)}/>}/>
                <TextInput
                    label="Confirm password"
                    secureTextEntry={!confirmPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    right={
                    <TextInput.Icon
                          icon={confirmPasswordVisible ? 'eye' : 'eye-off-outline'}
                          onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}/>}/>
                    <Button mode="contained" onPress={handleConfirm} style={styles.button}>
                      Confirm
                    </Button>
              </View>
            <Text>{JSON.stringify({username, name, email, password})}</Text>
      </KeyboardAwareScrollView>
    );
};
