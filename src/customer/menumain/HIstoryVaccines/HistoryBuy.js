import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import VaccinesBuy from './VaccinesBuy';
import COLORS from '../../../theme/constants';

const HistoryBuy = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
        try {
          const billsSnapshot = await firestore().collection('bills').get();
          const billsList = billsSnapshot.docs.map(doc => {
            const vaccine = doc.data().vaccine;
            const title = vaccine && vaccine.length > 0 ? vaccine[0].title : "Unknown Vaccine";
            return {
              vaccinationDate: doc.data().vaccinationDate,
              createdAt: doc.data().createdAt,
              orderId: doc.data().orderId,
              totalPrice: doc.data().totalPrice,
              title: title,
              paymentStatus: doc.data().paymentStatus,
              id: doc.id,
              vaccine: doc.data().vaccine,

            };
          });
          setBills(billsList);
        } catch (error) {
          console.error('Error fetching bills:', error);
        } finally {
          setLoading(false);
        }
      };
      
    fetchBills();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <VaccinesBuy
            orderId={item.orderId}
            vaccinationDate={item.vaccinationDate}
            createdAt={item.createdAt}
            totalPrice={item.totalPrice}
            title={item.title}
            paymentStatus={item.paymentStatus}
            vaccine={item.vaccine} 
            />
        )}
/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default HistoryBuy;
