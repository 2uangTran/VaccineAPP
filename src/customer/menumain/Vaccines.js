// Vaccines.js
import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button, Menu} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../../constants';
import {useMyContextController, addToCart} from '../../context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';

const Vaccines = ({id, title, price, imageUrl, description}) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCartWrapper = async () => {
    const item = {id, title, price, imageUrl, description};

    try {
      // Thêm sản phẩm vào bảng Cart trên Firestore
      await firestore().collection('Cart').add(item);
      console.log('Product added to cart:', item);
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
        <View style={styles.rowContainer}>
          <Image source={{uri: imageUrl}} style={styles.image} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          <Text style={styles.boldText}>Phòng bệnh: </Text>
          {description}
        </Text>
        <Text style={styles.price}>{formatPrice(price)}</Text>

        <View style={styles.buttonContainer}>
          <Button style={styles.buttonadd} onPress={handleAddToCartWrapper}>
            <AntDesign
              name="shoppingcart"
              size={20}
              color={COLORS.white}
              style={{marginRight: 10}}
            />
            <Text style={styles.buttonLabel}>Thêm vào giỏ</Text>
          </Button>
          <Button style={styles.buttonbuy} onPress={handleBuyNow}>
            <Text style={styles.buttonLabelbuy}>Mua ngay</Text>
          </Button>
        </View>
        {userLogin && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Text style={styles.menuAnchor}>...</Text>
              </TouchableOpacity>
            }>
            {isAdmin ? (
              <>
                <Menu.Item
                  onPress={() => {
                    navigation.navigate('UpdateVaccine', {
                      id,
                      title,
                      price,
                      imageUrl,
                      description,
                    });
                    closeMenu();
                  }}
                  title="Cập nhật Vaccine"
                />
                <Menu.Item
                  onPress={() => {
                    navigation.navigate('VaccineDetail', {
                      id,
                      title,
                      price,
                      imageUrl,
                      description,
                    });
                    closeMenu();
                  }}
                  title="Chi tiết Vaccine"
                />
              </>
            ) : null}
          </Menu>
        )}
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
