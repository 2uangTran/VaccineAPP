import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../theme/constants';
import Feather from 'react-native-vector-icons/Feather';
import auth from "@react-native-firebase/auth";
import { showMessage } from 'react-native-flash-message';

const Cart = ({ isOpenedFromVaccineForm, onSelectItems }) => {
  const [cartItems, setCartItems] = useState([]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = auth().currentUser.uid;
        const cartSnapshot = await firestore().collection('Cart').where('userId', '==', userId).get();
        const items = cartSnapshot.docs.map(doc => ({
          iddoc: doc.id,
          ...doc.data(),
          selected: false,
        }));
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleToggleCheckbox = (id) => {
    const updatedItems = cartItems.map(item => {
      if (item.iddoc === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleRemoveFromCart = async (iddoc) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to remove this service from your cart? This action cannot be undone.',
      [
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await firestore().collection('Cart').doc(iddoc).delete();
              setCartItems(prevItems =>
                prevItems.filter(item => item.iddoc !== iddoc),
              );
              showMessage({
                message: 'Thông báo',
                description: 'Xóa vắc xin thành công',
                type: 'success',
                floating: true,
                autoHide: true,
                duration: 3000,
              });
            } catch (error) {
              console.error('Error removing item from cart:', error);
            }
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  const handleConfirmSelection = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    onSelectItems(selectedItems);
  };

  const renderItem = ({ item }) => (
    <View key={item.iddoc} style={styles.itemContainer}>
      <View style={styles.rowContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
      <Text style={styles.description}>
        <Text style={styles.boldText}>Phòng bệnh: </Text>
        {item.description}
      </Text>
      <View style={styles.rowContainer}>
      <Text style={styles.price}>{formatPrice(item.price)}</Text>
        {!isOpenedFromVaccineForm && (
          <TouchableOpacity onPress={() => handleRemoveFromCart(item.iddoc)} style={styles.trashButton}>
            <Feather name="trash-2" size={24} color={COLORS.red} />
          </TouchableOpacity>
        )}
        {isOpenedFromVaccineForm && (
          <TouchableOpacity onPress={() => handleToggleCheckbox(item.iddoc)}>
            <Feather
              name={item.selected ? 'check-square' : 'square'}
              size={24}
              color={item.selected ? COLORS.blue : COLORS.black}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.iddoc}
        contentContainerStyle={styles.listContainer}
      />
      {isOpenedFromVaccineForm && (
        <TouchableOpacity onPress={handleConfirmSelection} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginTop: 10,
    paddingBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLORS.blue,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  confirmButton: {
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 17,
  },
});

export default Cart;
