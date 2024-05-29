import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Centers from './Centers';
import COLORS from '../../theme/constants';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Appbar} from 'react-native-paper';
import Cart from '../Cart/Cart';

const {height} = Dimensions.get('window');

const VaccineForm = () => {
  const [center, setCenter] = useState('');
  const [date, setDate] = useState('');
  const [vaccine, setVaccine] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [isCenterModalVisible, setIsCenterModalVisible] = useState(false);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [showCheckBox, setShowCheckBox] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;
          const userDoc = await firestore()
            .collection('USERS')
            .where('email', '==', userEmail)
            .get();
          if (!userDoc.empty) {
            userDoc.forEach(doc => {
              setUserInfo(doc.data());
            });
          } else {
            console.log('User document not found');
          }
        } else {
          console.log('No user is currently signed in');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const modalCenter = () => {
    setIsCenterModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const modalCart = () => {
    setIsCartModalVisible(true);
    setShowCheckBox(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setShowCheckBox(false);
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsCenterModalVisible(false);
      setIsCartModalVisible(false);
    });
  };

  const translateGender = gender => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    return gender;
  };

  const handleDateConfirm = date => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleCenterSelect = selectedCenter => {
    setCenter(selectedCenter.name);
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={toggleDetails}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>Chi tiết người tiêm</Text>
            <Feather
              name={detailsVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text>Loading...</Text>
        ) : userInfo && detailsVisible ? (
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ và tên</Text>
              <Text style={[styles.infoText, {textAlign: 'right'}]}>
                {userInfo.fullName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại</Text>
              <Text style={[styles.infoText, {textAlign: 'right'}]}>
                {userInfo.phone}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày sinh</Text>
              <Text style={[styles.infoText, {textAlign: 'right'}]}>
                {userInfo.birthDate}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mối quan hệ</Text>
              <Text style={[styles.infoText, {textAlign: 'right'}]}>
                Bản thân
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text
                style={[
                  styles.infoText,
                  styles.fullWidth,
                  {textAlign: 'right'},
                ]}>
                {userInfo.email}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ</Text>
              <Text
                style={[
                  styles.infoText,
                  styles.fullWidth,
                  {textAlign: 'right'},
                ]}>{`${userInfo.address}, ${userInfo.ward}\n${userInfo.district}, ${userInfo.province}`}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Chọn trung tâm mong muốn tiêm *</Text>
          <TouchableOpacity style={styles.input} onPress={modalCenter}>
            <Text style={{padding: 9}}>{center || 'Chọn địa điểm tiêm'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Chọn ngày mong muốn tiêm</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styles.input}
                placeholder="Chọn ngày"
                value={selectedDate.toLocaleDateString()}
                editable={false}
              />
              <Feather
                name="calendar"
                size={24}
                color="#007bff"
                style={styles.iconbutton}
              />
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={selectedDate}
            onConfirm={handleDateConfirm}
            onCancel={() => setShowDatePicker(false)}
            minimumDate={new Date()}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Chọn vắc xin *</Text>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              padding: 50,
            }}>
            <FontAwesome6 name="table-list" size={100} color={COLORS.gray} />
            <Text style={{left: '14%', color: '#CCCCCC', width: '100%'}}>
              Danh sách vắc xin chọn mua trống
            </Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.buttonAdd]} onPress={modalCart}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AntDesign
                name="shoppingcart"
                size={20}
                color={COLORS.white}
                style={{marginRight: 13, left: '100%'}}
              />
              <Text style={[styles.buttonTextAdd]}>Thêm từ giỏ</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonBuy]}>
            <Text style={[styles.buttonTextBuy]}>Thêm mới vắc xin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>0 VNĐ</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isCenterModalVisible}
        onRequestClose={() => setIsCenterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {transform: [{translateY: slideAnim}]},
            ]}>
            <Appbar style={styles.appbar}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.appbarText}>Danh sách trung tâm</Text>
              </View>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButtonText}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </Appbar>
            <Centers onSelect={handleCenterSelect} />
          </Animated.View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isCartModalVisible}
        onRequestClose={() => setIsCartModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {transform: [{translateY: slideAnim}]},
            ]}>
            <Appbar style={styles.appbar}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.appbarText}>Danh sách trung tâm</Text>
              </View>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButtonText}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </Appbar>
            <Cart isOpenedFromVaccineForm={isCartModalVisible} />

            {showCheckBox && (
              <TouchableOpacity
                onPress={closeModal}
                style={styles.buttonConfirm}>
                <Text style={styles.ButtonTextConfirm}>Xác nhận</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
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
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 20,
    color: COLORS.blue,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: COLORS.black,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonAdd: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 5,
  },
  buttonBuy: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.blue,
  },
  buttonTextAdd: {
    color: COLORS.white,
    textAlign: 'center',
    width: '70%',
  },
  buttonTextBuy: {
    color: COLORS.blue,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginHorizontal: 5,
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
  totalPrice: {
    fontSize: 19,
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 17,
    padding: 19,
  },
  totalContainer: {
    flexDirection: 'column',
  },
  infoBox: {
    paddingVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: '50%',
  },
  infoText: {
    flexShrink: 1,
    flex: 1,
    textAlign: 'right',
    color: 'black',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightradius: 20,
    height: height / 1.16,
  },
  appbar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  appbarText: {
    color: 'black',
    fontSize: 20,
    paddingLeft: 33,
    top: -20,
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: 'red',
    paddingRight: 0,
    top: -9,
  },
  buttonConfirm: {
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  ButtonTextConfirm: {
    color: COLORS.white,
    fontSize: 17,
  },
});

export default VaccineForm;
