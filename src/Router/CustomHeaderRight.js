import React, {useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useMyContextController, listenToCartCount} from '../context'; // Import listenToCartCount

const CustomHeaderRight = () => {
  const navigation = useNavigation();
  const [controller, dispatch] = useMyContextController();
  const {userLogin, cartCount} = controller;
  const isAdmin = userLogin?.role === 'admin';

  useEffect(() => {
    const unsubscribe = listenToCartCount(dispatch);

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const onPressHandler = () => {
    if (userLogin && userLogin.role === 'admin') {
      navigation.navigate('AddNewVaccine');
    } else {
      navigation.navigate('Cart');
    }
  };

  return (
    <View>
      {isAdmin ? (
        <TouchableOpacity onPress={onPressHandler} style={{marginRight: 10}}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPressHandler} style={{marginRight: 10}}>
          <MaterialCommunityIcons
            name="shopping-outline"
            size={24}
            color="white"
          />
          {cartCount > 0 && (
            <Text style={{
              color: 'white',
              position: 'absolute',
              top: 14,
              right: -6,
              backgroundColor: 'red',
              borderRadius: 50,
              paddingVertical: 2,
              paddingHorizontal: 6,
              fontSize: 11,
              textAlign: 'center',
              minWidth: 20,
            }}>
              {cartCount}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomHeaderRight;
