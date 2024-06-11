import React, {useEffect, useState} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {MyContextControllerProvider} from './src/context';
import {NavigationContainer} from '@react-navigation/native';
import RouterCustomer from './src/Router/RouterCustomer';
import COLORS from './src/theme/constants';
import {StatusBar} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from './src/LoginRegister/SplashScreen';

const App = () => {
  // const [isShowSplash, setIsShowSplash] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsShowSplash(false);
  //   }, 3000);
  // });
  return (
    <PaperProvider>
      <StatusBar backgroundColor={COLORS.blue} />
      <MyContextControllerProvider>
        <NavigationContainer>
          <RouterCustomer />
        </NavigationContainer>
      </MyContextControllerProvider>
      <FlashMessage position="top" />
    </PaperProvider>
  );
};

export default App;
