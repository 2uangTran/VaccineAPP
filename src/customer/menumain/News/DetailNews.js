import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../../theme/constants';
import {showMessage} from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
import CustomHeaderRightUpdate from '../../../Router/CustomHeaderRightUpdate';
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomHeaderRightNews from '../../../Router/CustomHeaderRightNews';

const DetailNews = ({route}) => {
  const {id, title, description} = route.params;
  const [newData, setNewData] = useState(null);

  useEffect(() => {
    const documentRef = firestore().collection('News').doc(id);

    documentRef
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          setNewData(data);
        } else {
          console.log('Không có dữ liệu cho ID này!');
        }
      })
      .catch(error => {
        console.log('Lỗi khi lấy dữ liệu:', error);
      });
  }, [id]);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CustomHeaderRightNews
          route={{
            params: {
              id,
              title: newData?.title,
              price: newData?.price,
              imageUrl: newData?.imageUrl,
              description: newData?.description,
              origin: newData?.origin,
              usage: newData?.usage,
            },
          }}
        />
      ),
    });
  }, [navigation, newData]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {newData ? (
        <>
          <Image source={{uri: newData.imageUrl}} style={styles.image} />
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{newData.title}</Text>
            {/* <Text style={styles.tag}>Còn hàng</Text> */}
            <Text style={styles.description}>
              <Text style={styles.boldText}>Tin tức - 06/06/2024</Text>
            </Text>
            <Text style={styles.desText}>{newData.description}</Text>

            {/* <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('ListVaccin')}>
                <AntDesign
                  name="shoppingcart"
                  size={20}
                  color={COLORS.white}
                  style={{marginRight: 5, paddingStart: 17}}
                />
                <Text style={styles.buttonTextAdd}>Đăng ký tiêm ngay</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </>
      ) : (
        <Text>Đang tải dữ liệu...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
    textTransform: 'uppercase',
  },
  // tag: {
  //   backgroundColor: COLORS.green,
  //   color: COLORS.white,
  //   fontWeight: 'bold',
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  //   alignSelf: 'flex-start',
  //   marginBottom: 10,
  // },
  info: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  desText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'justify',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginVertical: 20,
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  // },
  // addButton: {
  //   flex: 1,
  //   backgroundColor: COLORS.blue,
  //   padding: 15,
  //   borderRadius: 5,
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  // },
  // buyButton: {
  //   flex: 1,
  //   borderColor: COLORS.blue,
  //   borderWidth: 1,
  //   padding: 15,
  //   borderRadius: 5,
  //   alignItems: 'center',
  // },
  // buttonTextBuy: {
  //   color: COLORS.blue,
  // },
  // buttonTextAdd: {
  //   color: COLORS.white,
  //   alignItems: 'center',
  // },
});

export default DetailNews;
