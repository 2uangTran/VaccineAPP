import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../theme/constants';
import {useMyContextController} from '../../context';

const Record = ({id, title, imageUrl, center}) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [controller] = useMyContextController();
  const {userLogin} = controller;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const isAdmin = userLogin?.role === 'admin';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DetailRecord', {
              id,
              title,
              imageUrl,
              center,
            });
          }}>
          <View style={styles.rowContainer}>
            <Image source={{uri: imageUrl}} style={styles.image} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}></Text>
            </View>
          </View>
        </TouchableOpacity>
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
    fontSize: 16,
    marginTop: -15,
    color: COLORS.black,
    fontWeight: 'bold',
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
    color: COLORS.gray,
    marginTop: 15,
  },
});

export default Record;
