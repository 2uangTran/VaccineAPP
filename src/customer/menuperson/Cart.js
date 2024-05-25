// Cart.js
import React from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {useMyContextController} from '../../context';
import COLORS from '../../../constants';

const Cart = () => {
  const [controller] = useMyContextController();
  const {cartItems} = controller;

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
