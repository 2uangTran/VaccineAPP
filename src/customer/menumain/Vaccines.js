import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../theme/constants';
import { useMyContextController } from '../../context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import auth from "@react-native-firebase/auth";

const Vaccines = ({ id, title, price, imageUrl,origin, description,usage }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCartWrapper = async () => {
    const userId = auth().currentUser.uid;
    const item = { id, title, price, imageUrl, description, userId };
  
    try {
      const cartSnapshot = await firestore()
        .collection('Cart')
        .where('id', '==', id)
        .where('userId', '==', userId)
        .get();
  
      if (!cartSnapshot.empty) {
        showMessage({
          message: 'Thông báo',
          description: 'Bạn đã thêm vaccine này rồi. Vui lòng kiểm tra trong giỏ hàng.',
          type: 'warning',
          floating: true, 
          autoHide: true, 
          duration: 5000,
        });
        return;
      }
  
      await firestore().collection('Cart').add({
        ...item,
        vaccineId: id, 
      });
      console.log('Product added to cart:', item);
      showMessage({
        message: 'Thông báo',
        description: 'Vắc xin đã được thêm vào giỏ hàng',
        type: 'success',
        floating: true, 
        autoHide: true, 
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  

  const handleBuyNow = () => {
    // Viết logic xử lý khi mua ngay ở đây
  };

  const isAdmin = userLogin?.role === 'admin';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
      <TouchableOpacity
          onPress={() => {
            navigation.navigate('DetailVaccines', {
              id,
              title,
              price,
              imageUrl,
              description,
              origin,
              usage,
            });            
          }}
        >
          <View style={styles.rowContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
          </TouchableOpacity>
          <Text style={styles.description}>
            <Text style={styles.boldText}>Phòng bệnh: </Text>
            {description}
          </Text>
          <Text style={styles.price}>{formatPrice(price)}</Text>

        <View style={styles.buttonContainer}>
          {!isAdmin && (
            <Button style={styles.buttonadd} onPress={handleAddToCartWrapper}>
              <AntDesign
                name="shoppingcart"
                size={20}
                color={COLORS.white}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.buttonLabel}>Thêm vào giỏ</Text>
            </Button>
          )}
          {!isAdmin && (
            <Button style={styles.buttonbuy} onPress={handleBuyNow}>
              <Text style={styles.buttonLabelbuy}>Mua ngay</Text>
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginBottom: 10,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 23,
    marginTop: -47,
    color: COLORS.black,
  },
  description: {
    fontSize: 17,
    marginTop: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLORS.blue,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonadd: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.blue,
    borderWidth: 1,
    borderColor: COLORS.blue,
    marginHorizontal: 5,
  },
  buttonbuy: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.blue,
    marginHorizontal: 5,
  },
  buttonLabel: {
    color: COLORS.white,
  },
  buttonLabelbuy: {
    color: COLORS.blue,
  },
  menuAnchor: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
});

export default Vaccines;
