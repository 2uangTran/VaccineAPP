// Login.js
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {
  Button,
  Text,
  IconButton,
  TextInput,
  HelperText,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useMyContextController, login} from '../../src/context';
import COLORS from '../theme/constants';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('hoang12@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const hasErrorPassword = () => password.length < 6;
  const hasErrorEmail = () => !email.includes('@');

  useEffect(() => {
    if (userLogin) {
      navigation.navigate('Home');
    }
  }, [userLogin]);

  const onSubmit = () => {
    login(dispatch, email, password);
  };
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: 'bold',
          color: COLORS.pink,
          marginBottom: 30,
        }}>
        Login
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{marginVertical: 10, width: 390}}
        mode="outlined"
      />
      <HelperText type="error" visible={hasErrorEmail()}>
        Vui lòng nhập Email.
      </HelperText>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={{marginVertical: 10, width: 390}}
        right={
          <MaterialCommunityIcons
            name="eye"
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        mode="outlined"
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        Vui lòng nhập mật khẩu có đủ 6 ký tư.
      </HelperText>
      <Button
        mode="contained"
        onPress={onSubmit}
        disabled={hasErrorEmail() || hasErrorPassword()}
        style={{marginVertical: 10, padding: 5}}
        labelStyle={{fontSize: 20}}>
        Login
      </Button>
      <Text style={{marginTop: 10}}>Bạn chưa có tài khoản ? </Text>
      <Button onPress={navigateToRegister}>Đăng ký ngay</Button>
    </View>
  );
};

export default Login;
