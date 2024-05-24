import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../../constants';
import { useMyContextController } from '../../context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import Vaccines from './Vaccines';

const ListVaccin = () => {
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const ref = firestore().collection('vaccines');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, price, imageUrl, description } = doc.data();
        list.push({
          id: doc.id,
          title,
          price,
          imageUrl,
          description,
        });
      });
      setVaccines(list);

      if (loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [loading]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={COLORS.white}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên gói, tên vắc xin,..."
            placeholderTextColor={COLORS.white}
          />
        </View>
      </Appbar.Header>
        <FlatList
          data={vaccines}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Vaccines {...item} />}
          numColumns={1} 
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    width: '50%',
    borderRadius: 5,
    borderColor: COLORS.blue,
  },
  buttonContent: {
    backgroundColor: COLORS.white,
  },
  buttonLabel: {
    color: COLORS.blue,
  },
  menuAnchor: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 5,
  },
});

export default ListVaccin;

