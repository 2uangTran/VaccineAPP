import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Splash from '../theme/image/Splash.png';
import Login from './Login';
import {useNavigation} from '@react-navigation/native';
export default SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
  });
  return (
    <View>
      <View>
        <Image source={Splash} style={styles.image} />
      </View>
    </View>
  );
  S;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '1e1e1e',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
