import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { MyContextControllerProvider } from './src/context';
import { NavigationContainer } from '@react-navigation/native';
import RouterCustomer from './src/Router/RouterCustomer';
import COLORS from './src/theme/constants';
import { StatusBar } from 'react-native';
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <PaperProvider>
      <StatusBar backgroundColor={COLORS.blue} />
      <MyContextControllerProvider>
        <NavigationContainer>
          <RouterCustomer/>
        </NavigationContainer>
      </MyContextControllerProvider>
      <FlashMessage position="top" />
    </PaperProvider>
  );
}

export default App;
