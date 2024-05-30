import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import COLORS from '../../theme/constants';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from '../../context';
import firestore from '@react-native-firebase/firestore';

const Pay = () => {
  const [controller] = useMyContextController();
  const user = controller.userLogin;
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(true);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    fullName: '',
    birthDate: '',
    gender: '',
    nationality: 'Việt Nam',
    province: '',
    district: '',
    ward: '',
    address: '',
    email: '',
    occupation: 'Học sinh-sinh viên',
  });

  useEffect(() => {
    fetchUserData();
    fetchProvinces();
  }, []);

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
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : detailsVisible ? (
            <>
             <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                editable={false}
                onChangeText={(value) => handleInputChange('email', value)}
              />
              <Text style={styles.label}>Tỉnh / Thành phố</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.province}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('province', value)}
                >
                  {provinces.length > 0 ? (
                    provinces.map((province) => (
                      <Picker.Item key={province} label={province} value={province} />
                    ))
                  ) : (
                    <Picker.Item label="Không có dữ liệu" value="" />
                  )}
                </Picker>
              </View>

              <Text style={styles.label}>Quận / Huyện</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.district}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('district', value)}
                >
                  {districts && districts.length > 0 ? (
                    districts.map((district) => (
                      <Picker.Item key={district.id} label={district.id} value={district.id} />
                    ))
                  ) : (
                    <Picker.Item label="Không có dữ liệu" value="" />
                  )}
                </Picker>
              </View>

              <Text style={styles.label}>Phường / Xã</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.ward}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('ward', value)}
                >
                  {wards.length > 0 ? (
                    wards.map((ward) => (
                      <Picker.Item key={ward} label={ward} value={ward} />
                    ))
                  ) : (
                    <Picker.Item label="Không có dữ liệu" value="" />
                  )}
                </Picker>
              </View>

              <Text style={styles.label}>Địa chỉ</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
              />

             
            </>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>0</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} >
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
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
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
    color:COLORS.black,
  },
  button: {
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
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
