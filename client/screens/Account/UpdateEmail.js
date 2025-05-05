import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {Button, TextInput, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {IP, SCREEN_PADDING} from "../../Constants";
import axios from "axios";
import {AuthContext} from "../../context/auth";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const UpdateEmail = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [auth, setAuth] = useContext(AuthContext);
  const authenticated = auth && auth.token !== "" && auth.user !== null;

  const theme = useTheme()

  const handleConfirm = async () => {
    try{
      const resp = await axios.post(`http://${IP}:8080/api/update-email`,
          {password, oldEmail, newEmail})
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
          text2: `Email updated successfully.`,
          visibilityTime: 2000,
          autoHide: true,
        });
        navigation.navigate('Account Management');
      }
    } catch (e) {
      console.log(e)
    }
  };

  return (

        <View style={{...styles.container, backgroundColor: theme.colors.background}}>
          <View>
            {authenticated ? (
                <View style={styles.emailContainer}>
                  <Text style={{...styles.emailLabel, color: theme.colors.onSurface}}>
                    Your current email
                  </Text>
                  <Text style={{...styles.emailText, color: theme.colors.onSurfaceVariant}}>
                    {auth.email.replace(/(.{2}).+?(?=@)/, '$1***')}
                  </Text>
                </View>
            ) : null}

            <TextInput
                label="Password"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                right={
                  <TextInput.Icon
                      icon={passwordVisible ? 'eye' : 'eye-off-outline'}
                      onPress={() => setPasswordVisible(!passwordVisible)}/>}/>

            <TextInput label="Old email"
                       secureTextEntry={true}
                       onChangeText={setOldEmail}/>
            <TextInput label="New email"
                       secureTextEntry={true}
                       onChangeText={setNewEmail}/>
            <Button mode="contained" onPress={handleConfirm} style={styles.button}>Conform</Button>
          </View>
        </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: SCREEN_PADDING,
    paddingRight: SCREEN_PADDING,
  },
  button:{
    marginTop:15,
    marginHorizontal:10,
  },
  emailContainer: {
    marginVertical: 10,
    alignItems: 'center',
    padding: 40
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
  },
});