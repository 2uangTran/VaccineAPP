import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import COLORS from '../theme/constants';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {register} from '../context';

const Register = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    try {
      await register(fullName, email, password);
      navigation.navigate('Login');
      Alert.alert('Đăng ký tài khoản thành công');
    } catch (error) {
      if (error.message.includes('email already exists')) {
        setError('This email is already registered.');
      } else {
        console.error('Error registering:', error.message);
        setError(error.message);
      }
    }
  };
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#e8ecf4'}}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>Đăng ký tài khoản!</Text>
            <Text style={styles.subtitle}>
              Điền vào các trường bên dưới để bắt đầu với tài khoản mới của bạn.
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Tên đầy đủ</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={setFullName}
                placeholder="John Doe"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={fullName}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Địa chỉ Email</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email..."
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={email}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
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
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={setConfirmPassword}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={confirmPassword}
              />
            </View>
            <View style={styles.formAction}>
              <TouchableOpacity onPress={onSubmit}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Đăng ký</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity onPress={navigateToLogin} style={{marginTop: 'auto'}}>
          <Text style={styles.formFooter}>
            Bạn đã có tài khoản?{' '}
            <Text style={{textDecorationLine: 'underline'}}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
    marginBottom: 6,
  },
  /** Form */
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
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
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: COLORS.blue,
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
export default Register;
