import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";
import { useMyContextController } from '../../context';
import { showMessage } from 'react-native-flash-message';
import COLORS from '../../theme/constants';
import {  useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import LottieView from 'lottie-react-native';
import loadingAnimation from '../../theme/Loading/loadingcricle.json';

const UpdateInfo = () => {
  const [controller] = useMyContextController();
  const user = controller.userLogin;
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [isSaving, setIsSaving] = useState(false);


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

  const selectImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };
  const uploadImage = async (imageUri) => {
    try {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
      const imageRef = storage().ref('user_avatars').child(`${auth().currentUser.email}_avatar/${filename}`);
      await imageRef.putFile(uploadUri);
      const imageUrl = await imageRef.getDownloadURL(); // Lấy URL HTTP của ảnh
      return imageUrl; 
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        const areaSnapshot = await firestore().collection('area').get();
        const areaData = areaSnapshot.docs.map(doc => doc.id);
        setProvinces(areaData);
      } catch (error) {
        console.error('Error fetching area data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAreaData();
  }, []);
  
  useEffect(() => {
    if (user) {
      setFormData({
        phoneNumber: user.phone || '',
        fullName: user.fullName || '',
        birthDate: user.dateOfBirth || '',
        gender: user.gender || '',
        nationality: user.nationality || 'Việt Nam',
        ethnicity: user.ethnicity || '',
        province: user.province || '',
        district: user.district || '',
        ward: user.ward || '',
        address: user.address || '',
        email: user.email || '',
        occupation: user.occupation || 'Học sinh-sinh viên', 
      });
      setImageUri(user.avatarUrl || '');
    }
    fetchProvinces();
  }, [user]);
  

  const fetchProvinces = async () => {
    try {
      const areaSnapshot = await firestore().collection('area').get();
      const provincesData = areaSnapshot.docs.map(doc => doc.id);
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error fetching provinces:', error);
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
  
  const fetchWards = async (district) => {
    try {
      const areaSnapshot = await firestore().collection('area').doc(formData.province).collection('cities').doc(district).get();
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

  useEffect(() => {
    if (formData.province) {
      fetchDistricts(formData.province);
    }
  }, [formData.province]);
  
  useEffect(() => {
    if (formData.district && districts.length > 0) {
      fetchWards(formData.district);
    }
  }, [formData.district, districts]);

  useEffect(() => {
    if (formData.ward === "" && wards.length > 0) {
      setFormData(prevFormData => ({
        ...prevFormData,
        ward: wards[0]
      }));
    }
  }, [wards]);

  const handleInputChange = (key, value) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [key]: value };
      if (key === 'province' && prevFormData.province !== value) { 
        fetchDistricts(value);
        updatedFormData.district = '';
        updatedFormData.ward = '';
        fetchWards(''); 
      } else if (key === 'district') {
        fetchWards(value);
        updatedFormData.ward = '';
      }
      return updatedFormData;
    });
  };
  
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setFormData({ ...formData, birthDate: format(date, 'dd/MM/yyyy') });
    hideDatePicker();
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let imageUrl = formData.avatarUrl; 
  
      if (imageUri) { 
        imageUrl = await uploadImage(imageUri); 
        if (!imageUrl) {
          console.error('Failed to upload image.');
          return;
        }
      }
      
      const currentUserEmail = auth().currentUser.email;
      const userData = { ...formData };
      delete userData.avatarUrl; 
      if (imageUrl) {
        userData.avatarUrl = imageUrl; 
      }
      await firestore().collection('USERS').doc(currentUserEmail).update(userData);
      console.log('User data updated successfully');
      showMessage({
        message: 'Thông báo',
        description: 'Cập nhật thông tin thành công',
        type: 'success',
        floating: true, 
        autoHide: true, 
        duration: 3000,
      });
      
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
    finally {
      setIsSaving(false); 
    }
  };
  
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.userImageContainer}>
          <View style={styles.userImageWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.userImage} />
            ) : (
              <Image source={require('../../theme/image/images.png')} style={styles.userImage} />
            )}
            <TouchableOpacity style={styles.editIconContainer} onPress={selectImage}>
              <Icon name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>     
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
        />

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={formData.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <View style={styles.dateContainer}>
          <TextInput
            style={[styles.input, styles.dateInput]}
            value={formData.birthDate}
            onChangeText={(value) => handleInputChange('birthDate', value)}
            editable={false}
          />
          <TouchableOpacity onPress={showDatePicker}>
            <Icon name="calendar" size={24} color="#007bff" style={styles.iconbutton} />
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Text style={styles.label}>Giới tính</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.gender}
            style={styles.picker}
            onValueChange={(value) => handleInputChange('gender', value)}
          >
            <Picker.Item label="Nam" value="male" />
            <Picker.Item label="Nữ" value="female" />
          </Picker>
        </View>

        <Text style={styles.label}>Quốc tịch</Text>
        <TextInput
          style={styles.input}
          value={formData.nationality}
          onChangeText={(value) => handleInputChange('nationality', value)}
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
            selectedValue={formData.ward !== "" ? formData.ward : (wards.length > 0 ? wards[0] : '')} 
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

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />

        <Text style={styles.label}>Nghề nghiệp</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.occupation}
            style={styles.picker}
            onValueChange={(value) => handleInputChange('occupation', value)}
          >
            <Picker.Item label="Học sinh-sinh viên" value="Học sinh-sinh viên" />
            <Picker.Item label="Giảng viên/Giáo viên" value="Giảng viên/Giáo viên" />
            <Picker.Item label="Khác" value="Khác" />
          </Picker>
        </View>

        <Button title="Lưu" onPress={handleSave} disabled={loading || isSaving}/>
        
      </ScrollView>
      {isSaving && (
          <View style={styles.loadingContainer}>
            <LottieView
              style={{ width: 200, height: 200,justifyContent:'center',alignItems:'center' }} 
              source={loadingAnimation} 
              autoPlay
              loop
            />
          </View>
        )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  userImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userImageWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateInput: {
    flex: 1,
  },
  iconbutton: {
    padding: 10,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center', 
   
  },
});

export default UpdateInfo;
