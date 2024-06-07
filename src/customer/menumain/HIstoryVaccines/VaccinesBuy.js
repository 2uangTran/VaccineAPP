import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import COLORS from '../../../theme/constants';
import { Linking } from 'react-native';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import DetailBuy from './DetailBuy';

const VaccinesBuy = ({ orderId, totalPrice, vaccinationDate, createdAt, title, paymentStatus, vaccine }) => {
    const navigation = useNavigation();
    const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState(paymentStatus);

    const formatPrice = price => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleAddToCartWrapper = async () => {
        const userId = auth().currentUser.uid;
        const item = { title, totalPrice, orderId, vaccinationDate, createdAt, userId, vaccine };

        try {
            await firestore().collection('bills').doc(orderId).update({
                paymentStatus: 3, 
            });
            setUpdatedPaymentStatus(3);
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const handleDetailPress = () => {
        navigation.navigate('DetailBuy', { orderId });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardContainer}>
                 <TouchableOpacity onPress={handleDetailPress}>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.dateText}>{createdAt}</Text>
                            <Text style={styles.bookingCodeText}>Mã booking:
                                <Text style={{ fontWeight: 'bold', color: COLORS.black }}>{orderId}</Text>
                            </Text>
                        </View>
                        {updatedPaymentStatus === 0 && (
                            <Text style={[styles.paymentStatusText, styles.awaitingPayment]}>Chờ thanh toán</Text>
                        )}
                        {updatedPaymentStatus === 1 && (
                            <Text style={[styles.paymentStatusText, styles.paid]}>Đã thanh toán</Text>
                        )}
                        {updatedPaymentStatus === 3 && (
                            <Text style={[styles.paymentStatusText, styles.cancelled]}>Đã hủy</Text>
                        )}
                    </View>

                    <View style={{ flexDirection: 'column' }}>
                        {vaccine?.map((item, index) => (
                            <View key={item.id} style={styles.rowContainer}>
                                <View style={styles.titleContainerLeft}>
                                    <Text>{`Tên vắc xin (${index + 1})`}</Text>
                                </View>
                                <View style={styles.titleContainerRight}>
                                    <Text style={styles.title}>{item.title}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.titleContainerLeft}>
                            <Text>Tổng tiền cần thanh toán</Text>
                        </View>
                        <View style={styles.titleContainerRight}>
                            <Text style={styles.price}>{formatPrice(totalPrice)}</Text>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.titleContainerLeft}>
                            <Text>Hạn thanh toán</Text>
                        </View>
                        <View style={styles.titleContainerRight}>
                            <Text>{vaccinationDate}</Text>
                        </View>
                    </View>
                    {updatedPaymentStatus !== 3 && (
                    <TouchableOpacity
                        onPress={handleAddToCartWrapper}
                        style={styles.buttonAdd}
                    >
                        <Text style={styles.buttonLabel}>Thanh toán</Text>
                    </TouchableOpacity>
)}

                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '5%'
    },
    cardContainer: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 20,
        width: '90%',
        alignSelf: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    titleContainerLeft: {
        width: '50%',
        alignItems: 'flex-start',
    },
    titleContainerRight: {
        width: '50%',
        alignItems: 'flex-end',
        textAlign: 'right'
    },
    title: {
        fontSize: 18,
        color: COLORS.black,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.blue,
        marginTop: 5,
    },
    buttonAdd: {
        backgroundColor: COLORS.blue,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    buttonLabel: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      row: {
          flexDirection: 'row',
          paddingBottom: '10%',
          justifyContent: 'space-between',
          alignItems: 'center',
      },
      column: {
          flexDirection: 'column',
          width: '50%'
      },
      dateText: {
  
      },
      bookingCodeText: {
          width: '100%'
      },
      paymentStatusText: {
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 10,
          overflow: 'hidden',
          fontSize: 14,
      },
      awaitingPayment: {
          color: COLORS.orange2,
          backgroundColor: COLORS.orange1,
          fontSize: 16,
          fontWeight: 'bold'
      },
      paid: {
          marginLeft: 10,
          color: COLORS.green,
      },
      cancelled: {
        color: COLORS.white,
        backgroundColor: COLORS.red,
        fontSize: 16,
        fontWeight: 'bold'
      },
  });
  
  export default VaccinesBuy;