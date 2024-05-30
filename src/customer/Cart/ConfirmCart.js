import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import COLORS from '../../theme/constants';
import {useNavigation} from '@react-navigation/native';


const ConfirmCart = ({ route }) => {
  const navigation = useNavigation();
  const { userInfo, center, selectedDateTimestamp, vaccine } = route.params;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  const selectedDate = new Date(selectedDateTimestamp);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    vaccine.forEach(item => {
      totalPrice += item.price;
    });
    return formatPrice(totalPrice);
  };

  const handlePay = () => {
    navigation.navigate('Pay', { 
      userInfo: userInfo, 
      center: center, 
      vaccine: vaccine 
    });
  };
  
    const formatDate = (date) => {
  
        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();
    
       
        const paddedDay = day < 10 ? `0${day}` : day;
        const paddedMonth = month < 10 ? `0${month}` : month;
    
       
        return `${paddedDay}/${paddedMonth}/${year}`;
    };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Thông tin người được tiêm</Text>
        <View style={{borderWidth:1,borderRadius:5, padding:5}}>
        <View style={styles.section}>
          <Text style={styles.label}>Họ và tên:</Text>
          <Text style={styles.info}>{userInfo.fullName}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.info}>{userInfo.phone}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Ngày sinh:</Text>
          <Text style={styles.info}>{userInfo.birthDate}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{userInfo.email}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Địa chỉ:</Text>
          <Text style={styles.info}>{`${userInfo.address}, ${userInfo.ward}, ${userInfo.district}, ${userInfo.province}`}</Text>
        </View>
        </View>
        <Text style={styles.header}>Thông tin về việc tiêm</Text>
        <View style={{borderWidth:1,borderRadius:5, padding:5}}>
        <View style={styles.section}>
          <Text style={styles.label}>Trung tâm tiêm:</Text>
          <Text style={styles.info}>{center}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Ngày tiêm:</Text>
          <Text style={styles.info}><Text style={styles.info}>{formatDate(selectedDate)}</Text></Text>
        </View>
        </View>
        <Text style={styles.header}>Thông tin vắc xin đã chọn</Text>
        <View style={{borderWidth:1,borderRadius:5, padding:5}}>
          {vaccine.map((item, index) => (
            <View style={styles.itemContainer} key={index}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.header}>Thông tin thanh toán</Text>
        <View style={{borderWidth:1,borderRadius:5, padding:5}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:17,width:'50%'}}>Tổng tiền ({vaccine.length} sp)</Text>
            <Text style={styles.totalprices}>{calculateTotalPrice()}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:17}}>Thanh toán</Text>
            <Text style={styles.price}>{calculateTotalPrice()}</Text>
          </View>
        </View>
        
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>{calculateTotalPrice()}</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handlePay}>
          <Text style={styles.confirmButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: '#444',
    flex: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    color: COLORS.blue,
  },
  totalprices:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    color: COLORS.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 17,
    paddingHorizontal: 20, 
    backgroundColor: COLORS.gray,
  },
  totalContainer: {
    flexDirection: 'column',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.grey, 
  },
  totalPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.black, 
  },
  confirmButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  confirmButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmCart;
