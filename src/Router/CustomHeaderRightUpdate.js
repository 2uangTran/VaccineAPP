import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
  StyleSheet,
  Dimensions
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController, listenToCartCount } from '../context';
import Cart from '../customer/Cart/Cart';
import { Appbar } from 'react-native-paper';
import COLORS from '../theme/constants';

const { height } = Dimensions.get('window');

const CustomHeaderRightUpdate = ({ route }) => {
  const navigation = useNavigation();
  const [controller, dispatch] = useMyContextController();
  const { userLogin, cartCount } = controller;
  const isAdmin = userLogin?.role === 'admin';

  const { params } = route ? route : {};
  const { id, title, price, imageUrl, description, origin, usage } = params ? params : {};

  const [isModalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    const unsubscribe = listenToCartCount(dispatch);

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleEditPress = () => {
    if (isAdmin) {
      navigation.navigate('UpdateVaccines', {
        id,
        title,
        price,
        imageUrl,
        description,
        origin,
        usage,
      });
    } else {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={handleEditPress} style={{ paddingRight: 20 }}>
        <MaterialCommunityIcons
          name={isAdmin ? "square-edit-outline" : "shopping-outline"}
          size={24}
          color="white"
        />
        {!isAdmin && cartCount > 0 && (
          <Text style={styles.cartCount}>
            {cartCount}
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <Appbar style={styles.appbar}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.appbarText}>Danh sách vắc xin chọn mua</Text>
              </View>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </Appbar>
            <Cart />
            <TouchableOpacity onPress={closeModal} style={styles.buttonvictim}>
              <Text style={styles.ButtonTextVictim}>Đăng ký mũi tiêm ({cartCount})</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  }
});

export default CustomHeaderRightUpdate;
