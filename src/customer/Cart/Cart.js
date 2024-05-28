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
import COLORS from '../../theme/constants';
import {deleteVaccines} from '../../context/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from "@react-native-firebase/auth";
import Feather from 'react-native-vector-icons/Feather';


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  // const {cartid} = route.params;

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
          <View style={{ flexDirection: 'row' }}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <TouchableOpacity onPress={() => handleRemoveFromCart(item.iddoc)} style={{ marginLeft: 'auto' }}>
            <Feather name="trash-2" size={24} color={COLORS.red} />
          </TouchableOpacity>
        </View>
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
    paddingBottom:20
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
});

export default Cart;
