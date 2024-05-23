import {View, Text, SafeAreaView, StyleSheet, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Appbar, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../../constants';
import {useMyContextController} from '../../context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Vaccine from './Vaccines';

import {FlatList} from 'react-native-gesture-handler';

const ListVaccin = () => {
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const ref = firestore().collection('vaccines');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, price, imageUrl, description} = doc.data();
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
    <SafeAreaView style={{flex: 1}}>
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
          style={{flex: 1}}
          data={vaccines}
          keyExtractor={item => item.id}
          renderItem={({item}) => <Vaccine {...item} />}
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
    width: 370,
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListVaccin;
