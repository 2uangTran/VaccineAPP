import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import COLORS from '../../../theme/constants';
import firestore from '@react-native-firebase/firestore';

const VaccinesBuy = ({ orderId, totalPrice, vaccinationDate, createdAt, title, paymentStatus, vaccine }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState(paymentStatus);

    useEffect(() => {
        if (isFocused) {
            // Fetch updated data here
            fetchUpdatedData();
        }
    }, [isFocused]);

    useEffect(() => {
        // Check and delete the item if it meets the conditions
        checkAndDeleteIfExpired();
    }, [paymentStatus]);

    const fetchUpdatedData = async () => {
        try {
            const billDoc = await firestore().collection('bills').doc(orderId).get();
            if (billDoc.exists) {
                const updatedPaymentStatus = billDoc.data().paymentStatus;
                setUpdatedPaymentStatus(updatedPaymentStatus);
            }
        } catch (error) {
            console.error('Error fetching updated data:', error);
        }
    };

    const formatPrice = price => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };
    
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

    const handleAddToCartWrapper = async () => {
        const userId = auth().currentUser.uid;
        const item = { title, totalPrice, orderId, vaccinationDate, createdAt, userId, vaccine };

        try {
            await firestore().collection('bills').doc(orderId).update({
                paymentStatus: 3, // Update payment status to 3 (cancelled)
            });
            // Update the payment status locally
            setUpdatedPaymentStatus(3);
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const handleDetailPress = () => {
        navigation.navigate('DetailBuy', { orderId });
    };

    const checkAndDeleteIfExpired = async () => {
        try {
            const createdAtDate = new Date(createdAt); // Convert createdAt to Date object
            const currentDate = new Date(); // Current Date

            // Calculate the difference in milliseconds
            const difference = currentDate - createdAtDate;
            // Calculate the difference in days
            const differenceInDays = Math.floor(difference / (1000 * 3600 * 24));

            // Check if difference is more than 5 days and paymentStatus is 3 (cancelled)
            if (differenceInDays > 5 && updatedPaymentStatus === 3) {
                // Delete the item from firestore
                await firestore().collection('bills').doc(orderId).delete();
            }
        } catch (error) {
            console.error('Error checking and deleting expired item:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardContainer}>
                <TouchableOpacity onPress={handleDetailPress}>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
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
                            {updatedPaymentStatus === 3 ? (
                                <Text style={{ color: COLORS.red }}>Đã hủy</Text>
                            ) : (
                                <Text>{vaccinationDate}</Text>
                            )}
                        </View>
                    </View>
                    {updatedPaymentStatus !== 3 && updatedPaymentStatus !== 1 && (
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
        color: COLORS.white,
        backgroundColor: COLORS.green,
        fontSize: 16,
        fontWeight: 'bold'
    },
    cancelled: {
        color: COLORS.white,
        backgroundColor: COLORS.red,
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default VaccinesBuy;
