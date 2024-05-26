import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useRoute, useNavigation} from '@react-navigation/native';
import COLORS from '../../../constants';
import {deleteVaccines} from '../../context/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  // const {cartid} = route.params;


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartSnapshot = await firestore().collection('Cart').get();
        const items = cartSnapshot.docs.map(doc => ({
          iddoc: doc.id,
          ...doc.data(),
        }));
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);
  const handleRemoveFromCart = async iddoc => {
    Alert.alert(
      'Warning',
      'Are you sure you want to remove this service from your cart? This action cannot be undone.',
      [
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await deleteVaccines(iddoc);
              console.log(`Removing vaccine with id: ${iddoc}`);
              setCartItems(prevItems =>
                prevItems.filter(item => item.iddoc !== iddoc),
              );
             
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
      {cancelable: false},
    );
  };
  
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFromCart(item.iddoc)}>
        <Icon name="delete" size={24} color={COLORS.red} />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: COLORS.blue,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

export default Cart;
