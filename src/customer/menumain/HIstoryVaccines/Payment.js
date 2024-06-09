import React from 'react';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';


const Payment = () => {
    const route = useRoute();
    const { orderId, orderUrl } = route.params;
    const navigation = useNavigation();


    const updatePaymentStatus = async () => {
        try {
            await firestore().collection('bills').doc(orderId).update({ paymentStatus: 1 });
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
        navigation.navigate('HistoryBuy');
    };

    const handleNavigationStateChange = async (event) => {
        const url = event.url;
        const status = getQueryParam(url, 'status');
        if (status === '1') {
            await updatePaymentStatus();
            
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

    return (
        <WebView
            source={{ uri: orderUrl }}
            style={{ flex: 1 }}
            onNavigationStateChange={handleNavigationStateChange}
        />
    );
};

export default Payment;
