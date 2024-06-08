import React from 'react';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const PaymentWeb = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderUrl, ...orderDetails } = route.params;
 console.log(orderDetails)
  const createBill = async () => {
   
    try {
      await firestore().collection('bills').doc(orderDetails.orderId).set(orderDetails);
      for (const vaccine of orderDetails.vaccine) {
        const cartSnapshot = await firestore().collection('Cart').get();
        const matchingDocs = cartSnapshot.docs.filter(doc => doc.data().id === vaccine.id);
  
        if (matchingDocs.length > 0) {
          for (const doc of matchingDocs) {
            await firestore().collection('Cart').doc(doc.id).delete();
          }
        }
      }
      navigation.navigate('ConfirmationScreen', { orderDetails });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleNavigationStateChange = async (event) => {
    const url = event.url;
    const status = getQueryParam(url, 'status');
    if (status === '1') {
      createBill();
    }
  };

  const getQueryParam = (url, param) => {
    const queryString = url.split('?')[1] || '';
    const pairs = queryString.split('&');
    const params = {};
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params[param] || null;
  };
console.log(orderDetails)
  return (
    
    <WebView
      source={{ uri: orderUrl }}
      style={{ flex: 1 }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default PaymentWeb;
