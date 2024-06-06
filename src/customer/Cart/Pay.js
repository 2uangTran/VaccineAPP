import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';
import COLORS from '../../theme/constants';
import {useNavigation} from '@react-navigation/native';
import {useMyContextController} from '../../context';
import firestore from '@react-native-firebase/firestore';
import {RadioButton} from 'react-native-paper';
import {NativeModules, NativeEventEmitter} from 'react-native';

const {PayZaloBridge} = NativeModules;
const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);

const Pay = ({route}) => {
  const {userInfo, center, vaccine, totalPrice, selectedDate} = route.params;
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
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: user?.email || '',
    birthDate: '',
    province: '',
    district: '',
    ward: '',
    address: '',
  });
  const [paymentSelected, setPaymentSelected] = useState(false);

  useEffect(() => {
    const subscription = payZaloBridgeEmitter.addListener(
      'EventPayZalo',
      data => {
        if (data.returnCode == 1) {
          alert('Giao dịch thành công!');
        } else {
          alert('Giao dịch thất bại!');
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const formatDate = date => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generateOrderId = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  const handlePayment = async () => {
    if (!paymentSelected) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    const orderId = generateOrderId();
    const orderDetails = {
      orderId,
      fullname: `${formData.fullName}-${formData.birthDate}`,
      totalPrice,
      userInfo,
      center,
      vaccine,
      paymentStatus: 0,
      vaccinationDate: formatDate(selectedDate),
      paymentMethod: checked,
      createdAt: formatDate(new Date()),
      ...formData,
    };

    try {
      await firestore().collection('bills').doc(orderId).set(orderDetails);
      for (const vaccine of orderDetails.vaccine) {
        const cartSnapshot = await firestore().collection('Cart').get();
        const matchingDocs = cartSnapshot.docs.filter(
          doc => doc.data().id === vaccine.id,
        );

        if (matchingDocs.length > 0) {
          for (const doc of matchingDocs) {
            await firestore().collection('Cart').doc(doc.id).delete();
          }
        }
      }
      navigation.navigate('ConfirmationScreen', {orderDetails});
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUserEmail = user?.email;
        const userDoc = await firestore()
          .collection('USERS')
          .doc(currentUserEmail)
          .get();
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

    const fetchDistricts = async province => {
      try {
        const citySnapshot = await firestore()
          .collection('area')
          .doc(province)
          .collection('cities')
          .get();
        if (!citySnapshot.empty) {
          const districtData = citySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
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
        const areaSnapshot = await firestore()
          .collection('area')
          .doc(province)
          .collection('cities')
          .doc(district)
          .get();
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

    fetchUserData();
    fetchProvinces();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const togglePays = () => {
    setPayVisible(!payVisible);
  };

  const handlePaymentSelection = value => {
    setChecked(value);
    setPaymentSelected(true);
    if (value === 'zalo') {
      // Gọi phương thức payOrder từ NativeModule
      PayZaloBridge.payOrder(zptranstoken)
        .then(transactionId => {
          // Thực hiện xử lý khi thanh toán thành công
          alert('Giao dịch thành công! Mã giao dịch: ' + transactionId);
        })
        .catch(error => {
          // Xử lý khi có lỗi xảy ra trong quá trình thanh toán
          alert('Giao dịch thất bại!');
          console.error('Error during payment:', error);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{borderWidth: 1, padding: 10, borderRadius: 10}}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={toggleDetails}
              style={{flexDirection: 'row', alignItems: 'center'}}>
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
              <Text style={styles.label}>
                Họ và tên <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={value => handleInputChange('fullName', value)}
              />
              <Text style={styles.label}>
                Số điện thoại <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={value => handleInputChange('phoneNumber', value)}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                editable={false}
                onChangeText={value => handleInputChange('email', value)}
              />
              <Text style={styles.label}>
                Tỉnh / Thành phố <Text style={{color: 'red'}}>*</Text>
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.province}
                  style={styles.picker}
                  onValueChange={value => handleInputChange('province', value)}>
                  {provinces.length > 0 ? (
                    provinces.map(province => (
                      <Picker.Item
                        key={province}
                        label={province}
                        value={province}
                      />
                    ))
                  ) : (
                    <Picker.Item label="Không có dữ liệu" value="" />
                  )}
                </Picker>
              </View>

              <Text style={styles.label}>
                Quận / Huyện <Text style={{color: 'red'}}>*</Text>
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.district}
                  style={styles.picker}
                  onValueChange={value => handleInputChange('district', value)}>
                  {districts && districts.length > 0 ? (
                    districts.map(district => (
                      <Picker.Item
                        key={district.id}
                        label={district.id}
                        value={district.id}
                      />
                    ))
                  ) : (
                    <Picker.Item label="Không có dữ liệu" value="" />
                  )}
                </Picker>
              </View>

              <Text style={styles.label}>
                Phường / Xã <Text style={{color: 'red'}}>*</Text>
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.ward}
                  style={styles.picker}
                  onValueChange={value => handleInputChange('ward', value)}>
                  {wards.length > 0 ? (
                    wards.map(ward => (
                      <Picker.Item key={ward} label={ward} value={ward} />
                    ))
                  ) : (
                    <Picker.Item label="Không có dữ liệu" value="" />
                  )}
                </Picker>
              </View>

              <Text style={styles.label}>
                Địa chỉ <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={value => handleInputChange('address', value)}
              />
            </>
          ) : null}
        </View>
        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            marginTop: '2%',
          }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={togglePays}
              style={{flexDirection: 'row', alignItems: 'center'}}>
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="Thanh toán tại trung tâm"
                  status={
                    checked === 'Thanh toán tại trung tâm'
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() =>
                    handlePaymentSelection('Thanh toán tại trung tâm')
                  }
                  color={
                    checked === 'Thanh toán tại trung tâm' ? 'blue' : 'black'
                  }
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: checked === 'Thanh toán tại trung tâm' ? 20 : 16,
                    color:
                      checked === 'Thanh toán tại trung tâm' ? 'blue' : 'black',
                  }}>
                  Thanh toán tại trung tâm
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="credit_card"
                  status={checked === 'credit_card' ? 'checked' : 'unchecked'}
                  onPress={() => handlePaymentSelection('credit_card')}
                  color={checked === 'credit_card' ? 'blue' : 'black'}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: checked === 'credit_card' ? 20 : 16,
                    color: checked === 'credit_card' ? 'blue' : 'black',
                  }}>
                  {' '}
                  Thẻ tín dụng
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="paypal"
                  status={checked === 'paypal' ? 'checked' : 'unchecked'}
                  onPress={() => handlePaymentSelection('paypal')}
                  color={checked === 'paypal' ? 'blue' : 'black'}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: checked === 'paypal' ? 20 : 16,
                    color: checked === 'paypal' ? 'blue' : 'black',
                  }}>
                  {' '}
                  PayPal
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="zalo"
                  status={checked === 'zalo' ? 'checked' : 'unchecked'}
                  onPress={() => handlePaymentSelection('zalo')}
                  color={checked === 'zalo' ? 'blue' : 'black'}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    width: '100%',
                    color: checked === 'zalo' ? 'blue' : 'black',
                  }}>
                  ZaloPay
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(totalPrice)}
          </Text>
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
    fontSize: 18,
    color: COLORS.blue,
    paddingTop: '2%',
  },
  titleLabels: {
    fontWeight: 'bold',
    fontSize: 19,
    color: COLORS.blue,
    paddingTop: '2%',
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
    backgroundColor: COLORS.white,
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
