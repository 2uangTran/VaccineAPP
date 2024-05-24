import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Appbar, Button, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../../constants';
import { useMyContextController } from '../../context';
import AntDesign from 'react-native-vector-icons/AntDesign';


const Vaccines = ({ id, title, price, imageUrl, description }) => {
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

  const isAdmin = userLogin?.role === 'admin';

  return (
    <TouchableOpacity onPress={openMenu} style={styles.touchable}>
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
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
        <Button
          style={styles.button}>
          <AntDesign 
            name="shoppingcart"
            size={20}
            color={COLORS.white}
            style={{marginRight: 10}}
          />
          <Text style={styles.buttonLabel}>Thêm vào giỏ</Text>
        </Button>
        <Button
          style={styles.buttonbuy}>
          <Text style={styles.buttonLabelbuy}>Mua ngay</Text>
        </Button>
        </View>
        {userLogin && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Text style={styles.menuAnchor}>...</Text>}
          >
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
                  title="Update Vaccine"
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
                  title="Detail Vaccine"
                />
              </>
            ) : (
              <Menu.Item
                onPress={() => {
                  navigation.navigate('ConfirmOrder', {
                    vaccineName: title,
                    vaccinePrice: price,
                    imageUrl: imageUrl,
                  });
                  closeMenu();
                }}
                title="Confirm"
              />
            )}
          </Menu>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  appbar: {
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.white,
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  touchable: {
    width: '100%',
    marginBottom: 10, 
  },
  container: {
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
    marginTop:-47,
    color:COLORS.black,
  },
  description: {
    fontSize: 17,
    marginTop: 5, 
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    color:COLORS.blue,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.blue,  
    borderWidth: 1,
    borderColor: COLORS.blue,  
    marginHorizontal:5,
  },
  buttonContent: {
    backgroundColor: 'transparent', 
  },
  buttonLabel: {
    color: COLORS.white,  
  },
  menuAnchor: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 5,
  },
  buttonbuy:{
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.white,  
    borderWidth: 1,
    borderColor: COLORS.blue,  
    marginHorizontal:5,
  },
  buttonLabelbuy:{
    color: COLORS.blue,  
  },
  boldText: {
    fontWeight: 'bold',
    color:COLORS.black,
  },
});


export default Vaccines;
