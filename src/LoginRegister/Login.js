import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image, // Import Image component
} from 'react-native';
import {useMyContextController, login} from '../../src/context';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('hoang12@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;

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
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../theme/image/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Chào mừng quay trở lại!</Text>
          <Text style={styles.subtitle}>Đăng nhập với tài khoản của bạn</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Nhập địa chỉ Email</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={email}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Nhập mật khẩu</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={setPassword}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={password}
            />
          </View>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={onSubmit}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Đăng nhập</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.formFooter}>
              Bạn chưa có tài khoản?{' '}
              <Text style={{textDecorationLine: 'underline'}}>Đăng ký</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 16,
    padding: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1d',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  /** Form */
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Login;
