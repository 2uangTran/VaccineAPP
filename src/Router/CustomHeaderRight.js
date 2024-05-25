import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {IconButton} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {useMyContextController} from '../context';

const CustomHeaderRight = () => {
  const navigation = useNavigation();
  const [controller] = useMyContextController();
  const {userLogin} = controller;
  const isAdmin = userLogin?.role === 'admin';

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
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomHeaderRight;
