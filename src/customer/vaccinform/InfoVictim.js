// components/VaccineForm.js

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Icon} from 'react-native-elements';

const VaccineForm = () => {
  const [center, setCenter] = useState('');
  const [date, setDate] = useState('');
  const [vaccine, setVaccine] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>ĐỖ HUY HOÀNG</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Chọn trung tâm mong muốn tiêm *</Text>
        <TextInput
          style={styles.input}
          placeholder="Chọn địa điểm tiêm"
          value={center}
          onChangeText={setCenter}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Chọn ngày mong muốn tiêm</Text>
        <TextInput
          style={styles.input}
          placeholder="Chọn ngày"
          value={date}
          onChangeText={setDate}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Chọn vắc xin *</Text>
        <TextInput
          style={styles.input}
          placeholder="Chọn vắc xin"
          value={vaccine}
          onChangeText={setVaccine}
        />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Thêm từ giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Thêm mới vắc xin</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>

      <Text style={styles.totalText}>Tổng cộng 0 VNĐ</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VaccineForm;
