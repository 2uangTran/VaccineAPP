import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';

const UpdateInfo = ({
  initialPhoneNumber = '',
  initialFullName = '',
  initialBirthDate = '',
  initialGender = '',
  initialNationality = '',
  initialEthnicity = '',
  initialProvince = '',
  initialDistrict = '',
  initialWard = '',
  initialAddress = '',
  initialEmail = '',
  initialOccupation = '',
}) => {
  const [formData, setFormData] = useState({
    phoneNumber: initialPhoneNumber,
    fullName: initialFullName,
    birthDate: initialBirthDate,
    gender: initialGender,
    nationality: initialNationality,
    ethnicity: initialEthnicity,
    province: initialProvince,
    district: initialDistrict,
    ward: initialWard,
    address: initialAddress,
    email: initialEmail,
    occupation: initialOccupation,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* AppBar */}
        <View style={styles.appBar}>
          <Text style={styles.appBarText}>Hồ sơ cá nhân</Text>
        </View>

        {/* User Image */}
        <View style={styles.userImageContainer}>
          <Image
            source={{ uri: 'https://example.com/user-avatar.png' }} // Replace with your image URL
            style={styles.userImage}
          />
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
            style={styles.input}
            value={formData.birthDate}
            onChangeText={(value) => handleInputChange('birthDate', value)}
            editable={false} 
          />
          <Button title="Chọn ngày" onPress={showDatePicker} />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Text style={styles.label}>Giới tính</Text>
        <Picker
          selectedValue={formData.gender}
          style={styles.picker}
          onValueChange={(value) => handleInputChange('gender', value)}
        >
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
        </Picker>

        <Text style={styles.label}>Quốc tịch</Text>
        <TextInput
          style={styles.input}
          value={formData.nationality}
          onChangeText={(value) => handleInputChange('nationality', value)}
        />

        <Text style={styles.label}>Dân tộc</Text>
        <TextInput
          style={styles.input}
          value={formData.ethnicity}
          onChangeText={(value) => handleInputChange('ethnicity', value)}
        />

        <Text style={styles.label}>Tỉnh / Thành phố</Text>
        <TextInput
          style={styles.input}
          value={formData.province}
          onChangeText={(value) => handleInputChange('province', value)}
        />

        <Text style={styles.label}>Quận / Huyện</Text>
        <TextInput
          style={styles.input}
          value={formData.district}
          onChangeText={(value) => handleInputChange('district', value)}
        />

        <Text style={styles.label}>Phường / Xã</Text>
        <TextInput
          style={styles.input}
          value={formData.ward}
          onChangeText={(value) => handleInputChange('ward', value)}
        />

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
        <TextInput
          style={styles.input}
          value={formData.occupation}
          onChangeText={(value) => handleInputChange('occupation', value)}
        />

        <View style={styles.submitButton}>
          <Button title="Chỉnh sửa" onPress={() => { /* handle submit */ }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  appBarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    marginVertical: 8,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12
  },
  submitButton: {
    marginTop: 20,
  },
});

export default UpdateInfo;
