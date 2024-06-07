import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useMyContextController, listenToCartCount} from '../context';
import Cart from '../customer/Cart/Cart';
import {Appbar} from 'react-native-paper';
import COLORS from '../theme/constants';

const {height} = Dimensions.get('window');

const CustomHeaderRightAddRecord = () => {
  const navigation = useNavigation();
  const [controller, dispatch] = useMyContextController();
  const {userLogin, cartCount} = controller;
  const isAdmin = userLogin?.role === 'admin';

  const [isModalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    const unsubscribe = listenToCartCount(dispatch);

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const onPressHandler = () => {
    if (userLogin) {
      navigation.navigate('AddNewRecord');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={onPressHandler} style={{paddingRight: 20}}>
        <MaterialCommunityIcons
          name="plus-circle-outline"
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartCount: {
    color: 'white',
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: 'red',
    borderRadius: 50,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 11,
    textAlign: 'center',
    minWidth: 20,
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
    borderTopRightRadius: 20,
    height: height / 1.16,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
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
  appbarText: {
    color: 'black',
    fontSize: 18,
    paddingLeft: 33,
    top: -20,
    fontWeight: 'bold',
  },
  buttonvictim: {
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  ButtonTextVictim: {
    color: COLORS.white,
    fontSize: 17,
  },
});

export default CustomHeaderRightAddRecord;
