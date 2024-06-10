import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../theme/constants';
import {useMyContextController} from '../../context';
import {FlatList} from 'react-native-gesture-handler';
import Record from './Record';
import {Icon} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const ListRecord = () => {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState([]);
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const ref = firestore().collection('Record');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      const userId = auth().currentUser?.uid;

      querySnapshot.forEach(doc => {
        const {title, imageUrl, center, date, userIdentifier} = doc.data();
        if (userIdentifier === userId) {
          list.push({
            id: doc.id,
            title,
            imageUrl,
            center,
            date: date ? date : null,
          });
        }
      });

      setRecord(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userLogin]);

  const onPressHandler = () => {
    if (userLogin) {
      navigation.navigate('AddNewRecord');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.addButton} onPress={onPressHandler}>
          <Icon
            name="user-circle-o"
            type="font-awesome"
            size={24}
            color={COLORS.gray}
            style={styles.addIcon}
          />
          <Text style={styles.addText}>Thêm nhật ký của bạn...</Text>
          <Icon
            name="image"
            type="font-awesome"
            size={24}
            color={COLORS.gray}
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <FlatList
          data={record}
          keyExtractor={item => item.id}
          renderItem={({item}) => <Record {...item} />}
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
  headerContainer: {
    backgroundColor: '#EEF7FF',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  addText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'left',
  },
  addIcon: {
    marginHorizontal: 5,
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default ListRecord;
