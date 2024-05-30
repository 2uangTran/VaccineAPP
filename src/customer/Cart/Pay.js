import React, { useState, useEffect, NativeModules, NativeEventEmitter } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import COLORS from '../../theme/constants';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from '../../context';
import firestore from '@react-native-firebase/firestore';
import { RadioButton } from 'react-native-paper';

const Pay = () => {
  const [controller] = useMyContextController();
  const user = controller.userLogin;
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(true);
  const [payVisible, setPayVisible] = useState(true);
  const navigation = useNavigation();
  const [checked, setChecked] = useState('');
  const { PayZaloBridge } = NativeModules;
  const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUserEmail = user?.email;
        const userDoc = await firestore().collection('USERS').doc(currentUserEmail).get();
        const userData = userDoc.data();
        setFormData(userData);
        if (userData.province) {
          await fetchDistricts(userData.province);
        }
        if (userData.province && userData.district) {
          await fetchWards(userData.province, userData.district);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchProvinces = async () => {
      try {
        const areaSnapshot = await firestore().collection('area').get();
        const provincesData = areaSnapshot.docs.map(doc => doc.id);
        setProvinces(provincesData);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDistricts = async (province) => {
      try {
        const citySnapshot = await firestore().collection('area').doc(province).collection('cities').get();
        if (!citySnapshot.empty) {
          const districtData = citySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setDistricts(districtData);
        } else {
          console.log('No cities data found for the province:', province);
          setDistricts([]);
        }
        setWards([]);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };

    const fetchWards = async (province, district) => {
      try {
        const areaSnapshot = await firestore().collection('area').doc(province).collection('cities').doc(district).get();
        if (areaSnapshot.exists) {
          const wardsData = areaSnapshot.data().wards;
          setWards(wardsData);
        } else {
          console.log('No wards data found');
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };

    const handlePayment = () => {
      if (checked === 'zalo') {
        let payZP = NativeModules.PayZaloBridge;
        payZP.payOrder(zpTransToken.text);
      } else {
        // Handle other payment methods here
      }
    };

    fetchUserData();
    fetchProvinces();

    const subscription = payZaloBridgeEmitter.addListener('EventPayZalo', (data) => {
      if(data.returnCode == 1){
        alert('Payment successfully!');
      } else{
        alert('Payment failed!');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleInputChange = (key, value) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [key]: value };
      if (key === 'province' && prevFormData.province !== value) {
        fetchDistricts(value);
        updatedFormData.district = '';
        updatedFormData.ward = '';
      } else if (key === 'district') {
        fetchWards(formData.province, value);
        updatedFormData.ward = '';
      }
      return updatedFormData;
    });
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const togglePays = () => {
    setPayVisible(!payVisible);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ borderWidth: 1, padding: 10, borderRadius: 10 }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={toggleDetails}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.titleLabel}>Chi tiết người tiêm</Text>
              <Feather
                name={detailsVisible ? 'chevron-up' : 'chevron-down'}
                style={styles.titleLabels}
              />
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : detailsVisible ? (
            <>
              {/* Input fields for user details */}
            </>
          ) : null}
        </View>
        <View style={{ borderWidth: 1, padding: 10, borderRadius: 10, marginTop: '2%' }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={togglePays}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.titleLabel}>Phương thức thanh toán</Text>
              <Feather
                name={payVisible ? 'chevron-up' : 'chevron-down'}
                style={styles.titleLabels}
              />
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : payVisible ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                  value="credit_card"
                  status={checked === 'credit_card' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('credit_card')}
                />
                <Text style={{ fontSize: 20, color: checked === 'credit_card' ? 'black' : 'grey' }}> Thẻ tín dụng</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                  value="paypal"
                  status={checked === 'paypal' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('paypal')}
                />
                <Text style={{ fontSize: 20, color: checked === 'paypal' ? 'black' : 'grey' }}> PayPal</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                  value="zalo"
                  status={checked === 'zalo' ? 'checked': 'unchecked'}
                  onPress={() => setChecked('zalo')}
                />
                <Text style={{ fontSize: 20, color: checked === 'zalo' ? 'black' : 'grey' }}>ZaloPay</Text>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>0</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handlePayment}>
          <Text style={styles.confirmButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 10,
  },
  titleLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.blue,
    paddingTop: '2%'
  },
  titleLabels: {
    fontWeight: 'bold',
    fontSize: 19,
    color: COLORS.blue,
    paddingTop: '2%'
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
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

export default Pay;

