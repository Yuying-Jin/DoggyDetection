import React, {useContext, useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Card, Icon, TextInput, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/auth";
import axios from "axios";
import {IP} from "../../Constants";

export const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useContext(AuthContext);
  const theme = useTheme();
  console.log(auth)
  const handleLogin = async () => {
    try{
      const resp = await axios.post(`http://${IP}:8080/api/login`, {username, password})
      console.log(JSON.stringify(resp.data))
      if (resp.data.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Username or Password is wrong.',
          text3: resp.data.error,
          visibilityTime: 2000,
          autoHide: true,
        });
      } else {
        await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
        Toast.show({
          type: 'success',
          text1: 'Hello!',
          text2: `Welcome, ${username}!`,
          visibilityTime: 2000,
          autoHide: true,
        });
        navigation.navigate('Camera');
      }
    } catch (e) {
      console.log(e)
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleResetPassword = () => {
    navigation.navigate('Reset Password');
  };

  return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.iconContainer}>
              <Icon size={50} source="dog" color={theme.colors.primary} />
            </View>
          </Card.Content>
          <Card.Content>
            <TextInput label="Username" onChangeText={setUsername} />
            <TextInput label="Password" secureTextEntry={true} onChangeText={setPassword} />
          </Card.Content>

          <Card.Actions style={styles.actions}>
            <Button mode="contained" onPress={handleLogin} style={styles.button}>Login</Button>

            <Text style={{...styles.link, color: theme.colors.onBackground}}
                  onPress={handleRegister}>Register</Text>
            <Text style={{...styles.link, color: theme.colors.onBackground}}
                  onPress={handleResetPassword}>Reset Password</Text>
          </Card.Actions>
        </Card>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  card: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  link: {
    marginTop: 10,
  },
});

