import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 
import VaccinesBuy from './VaccinesBuy';
import COLORS from '../../../theme/constants';
import LottieView from 'lottie-react-native';
import loadingAnimation from '../../../theme/Loading/loadingcricle.json';


const HistoryBuy = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;
          const billsSnapshot = await firestore()
            .collection('bills')
            .where('email', '==', userEmail)
            .get();
          
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
              email: doc.data().email,
              vaccine: doc.data().vaccine,
            };
          });
  
          billsList.sort((a, b) => {
            const dateA = new Date(
              parseInt(a.createdAt.split('/')[2]), 
              parseInt(a.createdAt.split('/')[1]) - 1, 
              parseInt(a.createdAt.split('/')[0]) 
            );
            const dateB = new Date(
              parseInt(b.createdAt.split('/')[2]), 
              parseInt(b.createdAt.split('/')[1]) - 1, 
              parseInt(b.createdAt.split('/')[0]) 
            );
  
            if (dateA.getTime() === dateB.getTime()) {
              return b.id.localeCompare(a.id); 
            }
  
            return dateB - dateA;
          });
  
          setBills(billsList);
          setNoData(billsList.length === 0);
        }
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
        <LottieView
            style={{ width: 200, height: 200,justifyContent:'center',alignItems:'center' }} 
            source={loadingAnimation} 
            autoPlay
            loop
          />
      </SafeAreaView>
    );
  }

  if (noData) {
    return (
      <SafeAreaView style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Không có dữ liệu đặt mua vắc xin</Text>
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
            email={item.email}
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryBuy;
