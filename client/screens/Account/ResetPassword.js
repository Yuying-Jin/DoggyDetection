import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, TextInput, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {IP, SCREEN_PADDING} from "../../Constants";
import axios from "axios";
import {AuthContext} from "../../context/auth";

export const ResetPassword = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [auth, setAuth] = useContext(AuthContext);
  const theme = useTheme();

  const handleConfirm = async () => {
    try{
      const resp = await axios.post(`http://${IP}:8080/api/reset-password`,
          {username, oldPassword, newPassword, confirmNewPassword})
      if (resp.data.error) {
        console.log(resp.data.error)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: resp.data.error,
          visibilityTime: 2000,
          autoHide: true,
        });
      } else {
        setAuth(resp.data);
        await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
        console.log(resp.data)
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Password updated successfully.`,
          visibilityTime: 2000,
          autoHide: true,
        });
        navigation.navigate('Camera');
      }
    } catch (e) {
      console.log(e)
    }
  };

  return (
        <ScrollView style={{...styles.container, backgroundColor: theme.colors.background}}>
          <View>
            <TextInput label="Username" onChangeText={setUsername}/>
            <TextInput label="Old password"
                       secureTextEntry={true}
                       right={<TextInput.Icon icon="eye-off-outline"/>}
                       onChangeText={setOldPassword}/>
            <TextInput label="New password"
                       secureTextEntry={true}
                       right={<TextInput.Icon icon="eye-off-outline"/>}
                       onChangeText={setNewPassword}/>
            <TextInput label="Confirm password"
                       secureTextEntry={true}
                       right={<TextInput.Icon icon="eye-off-outline"/>}
                       onChangeText={setConfirmNewPassword}/>
            <Button mode="contained" onPress={handleConfirm} style={styles.button}>Conform</Button>
          </View>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: SCREEN_PADDING,
    paddingRight: SCREEN_PADDING,
  },
  button:{
    marginTop:15,
    marginHorizontal:10,
  }
});