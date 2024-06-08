import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Modal,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import COLORS from '../../../theme/constants';
import Centers from '../../vaccinform/Centers';
import {Appbar} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const {height} = Dimensions.get('window');

const AddNewRecord = () => {
  const [record, setRecord] = useState('');
  const [recordError, setRecordError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const ref = firestore().collection('Record');
  const [records, setRecordList] = useState([]);
  const [isCenterModalVisible, setIsCenterModalVisible] = useState(false);
  const [centerError, setCenterError] = useState('');
  const [center, setCenter] = useState('');
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [userInfo, setUserInfo] = useState(null);

  async function addRecord() {
    if (record.trim() === '') {
      setRecordError('Chưa nhập nội dung');
      return;
    } else {
      setRecordError('');
    }
  
    let imageUrl = '';
    if (imageUri) {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
      const task = storage().ref(filename).putFile(uploadUri);
  
      try {
        await task;
        imageUrl = await storage().ref(filename).getDownloadURL();
      } catch (e) {
        console.error(e);
      }
    }
  
    console.log('imageUrl:', imageUrl); 
  
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
  
    const formattedDate = `${day}/${month}/${year}`;
  
    
    const currentUser = auth().currentUser;
    const userIdentifier = currentUser ? currentUser.uid : ''; 
  
    const newRecord = {
      title: record,
      imageUrl,
      center,
      date: formattedDate, 
      userIdentifier, 
    };
  
    ref.add(newRecord);
    setRecord('');
    setImageUri(null);
    resetCenter();
  }
  

  const resetCenter = () => {
    setCenter('');
  };
  const selectImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const modalCenter = () => {
    setIsCenterModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsCenterModalVisible(false);
    });
  };

  const handleCenterSelect = selectedCenter => {
    setCenter(selectedCenter.name);
    setIsCenterModalVisible(false);
  };

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

    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, imageUrl, center} = doc.data();
        list.push({
          id: doc.id,
          title,
          imageUrl,
          center,
        });
      });
      setRecordList(list);

      if (loading) {
        setLoading(false);
      }
    });
    fetchUserInfo();
    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  const isFormValid = record.trim() !== '' && imageUri;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {loading ? (
            <Text>Loading...</Text>
          ) : userInfo ? (
            <View style={styles.infoBox}>
              <InfoItem
                style={styles.appbarText}
                fullName={userInfo.fullName}
                center={center}
              />
            </View>
          ) : (
            <Text>Thông tin người dùng không khả dụng</Text>
          )}
          <View style={styles.row}>
            <TextInput
              style={styles.titleInput}
              placeholder="Bạn đang nghĩ gì?"
              value={record}
              onChangeText={setRecord}
              placeholderTextColor="#888"
              multiline={true}
              textAlignVertical="top"
            />
          </View>
          {imageUri ? (
            <Image source={{uri: imageUri}} style={styles.image} />
          ) : null}
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon
                name="smile-o"
                type="font-awesome"
                size={25}
                color={COLORS.blue}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={selectImage}>
              <Icon
                name="image-plus"
                type="material-community"
                size={25}
                color={COLORS.blue}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon
                onPress={modalCenter}
                name="map-marker-plus-outline"
                type="material-community"
                size={25}
                color={COLORS.blue}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          {recordError ? (
            <Text style={styles.errorText}>{recordError}</Text>
          ) : null}
          <View style={styles.formGroup}>
            {center ? (
              <TouchableOpacity style={styles.input} onPress={modalCenter}>
                <Text style={{padding: 9}}>{center}</Text>
              </TouchableOpacity>
            ) : null}
            {centerError ? (
              <Text style={styles.errorText}>{centerError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, !isFormValid && styles.submitBtnDisabled]}
            onPress={isFormValid ? addRecord : null}
            disabled={!isFormValid}>
            <Text style={styles.submitBtnText}>Đăng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={styles.appbarText}>Danh sách trung tâm</Text>
                </View>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButtonText}>
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </Appbar>
            <Centers onSelect={handleCenterSelect} />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const InfoItem = ({fullName, center, numberOfLines = 1}) => (
  <View style={styles.infoBlock}>
    <View style={styles.iconTextContainer}>
      <Icon
        name="user-circle-o"
        type="font-awesome"
        size={25}
        color={COLORS.black}
        style={styles.icon}
      />
      <Text style={styles.infoText}>
        {fullName} {center ? <Text style={styles.atText}>tại </Text> : null}
        {center}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },

  atText: {
    fontSize: 18,
    color: COLORS.gray, // Đổi màu cho từ "tại"
    fontWeight: 'bold',
    textTransform: 'none',
    fontFamily: 'Montserrat',
  },
  infoText: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Montserrat',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height / 1.16,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBox: {
    borderColor: COLORS.gray,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  appbarText: {
    color: 'black',
    fontSize: 20,
    paddingLeft: 33,
    top: -20,
    fontWeight: 'bold',
  },
  appbar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    paddingRight: 0,
    top: -9,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  titleInput: {
    flex: 1,
    padding: 10,
    color: '#000',
    fontSize: 18,
    height: 50,
  },
  iconButton: {
    marginLeft: 10,
    marginTop: 15,
  },
  icon: {
    marginRight: 10,
  },
  submitBtn: {
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default AddNewRecord;
