import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {useContext, useState} from "react";
import {AuthContext} from "../context/auth";
import {SafeAreaView, StyleSheet, TouchableOpacity, View, Image} from "react-native";
import {Icon} from "react-native-paper";

export const ProfilePhoto = () => {
    const [profilePhoto, setProfilePhoto] = useState({ url: "", public_id: "" });
    const [auth, setAuth] = useContext(AuthContext);
    // const handleUpload = async () => {
    //     let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (permissionResult.granted === false) {
    //         alert("Camera access is required");
    //         return;
    //     }
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //       allowsEditing: true,
    //         aspect: [4, 3],
    //         base64: true,
    //     });
    //     if (result.canceled) {
    //         return;
    //     }
    //     setProfilePhoto(result.assets[0].uri);
    //
    //     let storedData = await AsyncStorage.getItem("auth-rn");
    //     const parsed = JSON.parse(storedData);
    //
    //     const { data } = await axios.post(`http://${IP}:8080/api/upload-image`, {
    //         profilePhoto: result.assets[0].uri,
    //         user: parsed.user
    //     });
    //     console.log("UPLOADED RESPONSE => ", data);
    //     const stored = JSON.parse(await AsyncStorage.getItem("auth-rn"));
    //     stored.user = data;
    //     await AsyncStorage.setItem("auth-rn", JSON.stringify(stored));
    //     setAuth({...auth, user: data });
    //     setProfilePhoto(data.profilePhoto);
    //     alert("Profile image saved");
    // };

    return (
        <SafeAreaView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    imageContainer: {
        justifyContent: "center", alignItems: "center"
    },
    imageStyles: {
        width: 80, height: 80, marginVertical: 20
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
