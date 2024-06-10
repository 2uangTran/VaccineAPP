import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../theme/constants';
import {useMyContextController} from '../../context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import Vaccines from './Vaccines';
import LottieView from 'lottie-react-native';

const ListVaccin = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const [results2, setResults2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const ref = firestore().collection('vaccines');
  const navigation = useNavigation();

  const handleButtonPress = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('vaccines')
      .onSnapshot(snapshot => {
        setResults(snapshot.docs.map(doc => doc.data()));
      });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const filteredResults = results?.filter(result =>
      result.title.toLowerCase().includes(search.toLowerCase()),
    );
    setResults2(filteredResults);
  }, [search, results]);

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];

      querySnapshot.forEach(doc => {
        const {title, price, imageUrl, description, date} = doc.data();
        list.push({
          id: doc.id,
          title,
          price,
          imageUrl,
          description,
          date: date ? new Date(date) : null,
        });
      });

      list.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date - a.date;
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
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              placeholder="Tìm theo tên gói, tên vắc xin,..."
              placeholderTextColor={COLORS.white}
            />
          </View>
        </Appbar.Header>
        {results2 && (
          <FlatList
            key={results2?.id}
            data={results2}
            keyExtractor={item => item.id}
            renderItem={({item}) => <Vaccines {...item} />}
            numColumns={1}
            contentContainerStyle={styles.list}
          />
        )}
        <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
          <Text style={styles.buttonLabel}>Press Me!</Text>
        </TouchableOpacity>
        {loading && (
          <View style={styles.loadingContainer}>
            <LottieView
              style={styles.loadingAnimation}
              source={require('../../theme/Loading/loadingcricle.json')}
              autoPlay
              loop
            />
          </View>
        )}
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
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonLabel: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
});

export default ListVaccin;
