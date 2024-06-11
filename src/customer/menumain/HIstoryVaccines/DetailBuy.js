import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DetailBuy = ({ route }) => {
  const { orderId } = route.params;
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const billRef = firestore().collection('bills').doc(orderId);
        const billDoc = await billRef.get();
        if (billDoc.exists) {
          setBill(billDoc.data());
        } else {
          console.log('No such bill exists!');
        }
      } catch (error) {
        console.error('Error fetching bill details:', error);
      }
    };

    fetchBillDetails();
  }, [orderId]);

  const handleCancelRegistration = async () => {
    try {
      await firestore().collection('bills').doc(orderId).update({
        paymentStatus: 3,
      });
      setBill({ ...bill, paymentStatus: 3 });
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  if (!bill) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bookingCode}>Mã booking: {bill.orderId}</Text>
        <View style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>
            {bill.paymentStatus === 0 ? 'Chờ thanh toán' : bill.paymentStatus === 3 ? 'Đã hủy' : 'Đã thanh toán'}
          </Text>
        </View>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin người mua</Text>
        <View style={styles.column}>
          <Text style={styles.infoText}>Họ và tên: </Text>
          <Text style={styles.text}>{bill.fullName}</Text>
        </View>
        <View style={styles.column}>
        <Text style={styles.infoText}>Số điện thoại: </Text>
        <Text style={styles.text}>{bill.phoneNumber}</Text>
        </View>
        <View style={styles.column}>
        <Text style={styles.infoText}>Email: </Text>
        <Text style={styles.text}>{bill.email}</Text>
        </View>
        <View style={styles.column}>
        <Text style={styles.infoText}>Địa chỉ: </Text>
        <Text style={styles.text}>{`${bill.address}, ${bill.ward}\n${bill.district}, ${bill.province}`}</Text>
        </View>
      </View>
      <View style={styles.paymentInfo}>
        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
        <Text style={styles.infoText}>Hình thức: {bill.paymentMethod}</Text>
        <Text style={[styles.infoText, { color: bill.paymentStatus === 3 ? 'red' : 'black' }]}>
          Trạng thái: {bill.paymentStatus === 0 ? 'Chờ thanh toán' : bill.paymentStatus === 3 ? 'Đã hủy' : 'Đã thanh toán'}
        </Text>
        <Text style={styles.infoText}>Tổng tiền cần thanh toán: {bill.totalPrice} VND</Text>
        <Text style={styles.infoText}>Hạn thanh toán: {bill.vaccinationDate}</Text>
      </View>
      
      {!route.params.readOnly && bill.paymentStatus !== 3 &&  bill.paymentStatus !== 1 &&(
    <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRegistration}>
        <Text style={styles.buttonText}>Hủy đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payButton}>
        <Text style={styles.buttonText}>Thanh toán</Text>
        </TouchableOpacity>
    </View>
    )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  column:{
    flexDirection:'column',
  },
  header: {
    backgroundColor: '#FFCC00',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingCode: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
  paymentButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  paymentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#FFA500',
    fontSize: 18,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  paymentInfo: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e2e2',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', 
    position: 'absolute', 
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    padding:10
  },
  
  cancelButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: 8, 
  },
  
  payButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15, 
    paddingHorizontal: 50, 
    borderRadius: 8, 
  },
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text:{
    fontSize:18,
    fontWeight:'bold',
    color:'black'
  }
});

export default DetailBuy;
