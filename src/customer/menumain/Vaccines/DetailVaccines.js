import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../../theme/constants';
import { showMessage } from 'react-native-flash-message';
import auth from "@react-native-firebase/auth";
import CustomHeaderRightUpdate from '../../../Router/CustomHeaderRightUpdate';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useMyContextController } from '../../../context';

const DetailVaccines = ({ route }) => {
  const { id, title, price, imageUrl, description, origin, usage } = route.params;
  const [vaccineData, setVaccineData] = useState(null);
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    const documentRef = firestore().collection('vaccines').doc(id);

    documentRef.get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setVaccineData(data);
        } else {
          console.log("Không có dữ liệu cho ID này!");
        }
      })
      .catch((error) => {
        console.log("Lỗi khi lấy dữ liệu:", error);
      });
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CustomHeaderRightUpdate
          route={{
            params: {
              id,
              title: vaccineData?.title,
              price: vaccineData?.price,
              imageUrl: vaccineData?.imageUrl,
              description: vaccineData?.description,
              origin: vaccineData?.origin,
              usage: vaccineData?.usage,
            },
          }}
        />
      ),
    });
  }, [navigation, vaccineData]);

  const isAdmin = userLogin?.role === 'admin';

  const handleAddToCartWrapper = async () => {
    const item = { id, title, price, imageUrl, description, userId: auth().currentUser.uid };

    try {
      const cartSnapshot = await firestore()
        .collection('Cart')
        .where('id', '==', id)
        .where('userId', '==', auth().currentUser.uid)
        .get();

      if (!cartSnapshot.empty) {
        showMessage({
          message: 'Thông báo',
          description: 'Bạn đã thêm vaccine này rồi. Vui lòng kiểm tra trong giỏ hàng.',
          type: 'warning',
          floating: true,
          autoHide: true,
          duration: 3000,
        });
        return;
      }

      await firestore().collection('Cart').add(item);
      console.log('Product added to cart:', item);
      showMessage({
        message: 'Thông báo',
        description: 'Vắc xin đã được thêm vào giỏ hàng',
        type: 'success',
        floating: true,
        autoHide: true,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleDeleteVaccine = async () => {
    try {
      // Xóa vắc xin
      await firestore().collection('vaccines').doc(id).delete();
  
      // Lấy danh sách các tài liệu trong giỏ hàng có id của vắc xin bị xóa
      const cartSnapshot = await firestore()
        .collection('Cart')
        .where('id', '==', id)
        .get();
  
      if (!cartSnapshot.empty) {
        cartSnapshot.forEach(async (doc) => {
         
          const userId = doc.data().userId;
  
         
          await firestore().collection('Cart').doc(doc.id).delete();
          console.log('Document in cart deleted:', doc.id);
  
          
          const notiContent = {
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/kthp-bb423.appspot.com/o/Thongbao.jpg?alt=media&token=1e9883c9-c632-43da-9409-34c4e09a3ba7',
            title: "Sản phẩm vừa bị xóa khỏi danh sách vắc xin",
            description: `Chúng tôi có 1 sản phẩm vừa bị xóa khỏi danh mục vì trong giỏ hàng của bạn có 1 sản phẩm mà chúng tôi vừa xóa. Chúng tôi rất xin lỗi vì sự bất tiện này.`,
            userId: userId, 
          };
  
       
          await firestore().collection('Notification').add(notiContent);
        });
      }
      navigation.goBack();
      showMessage({
        message: 'Thông báo',
        description: 'Vắc xin đã được xóa thành công',
        type: 'success',
        floating: true,
        autoHide: true,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting vaccine:', error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {vaccineData ? (
        <>
          <Image source={{ uri: vaccineData.imageUrl }} style={styles.image} />
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{vaccineData.title}</Text>
            <Text style={styles.tag}>Còn hàng</Text>
            <Text style={styles.info}><Text style={styles.boldText}>Nguồn gốc:</Text> {vaccineData.origin}</Text>
            <Text style={styles.info}><Text style={styles.boldText}>Phòng bệnh:</Text> {vaccineData.description}</Text>
            {vaccineData.usage && (
              <Text style={styles.info}><Text style={styles.boldText}>Cách sử dụng:</Text> {vaccineData.usage}</Text>
            )}
            <Text style={styles.price}>{formatPrice(vaccineData.price)}</Text>

            <View style={styles.buttonContainer}>
              {!isAdmin && (
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCartWrapper}>
                  <AntDesign
                    name="shoppingcart"
                    size={20}
                    color={COLORS.white}
                    style={{ marginRight: 10, paddingStart: 17 }}
                  />
                  <Text style={styles.buttonTextAdd}>Thêm vào giỏ</Text>
                </TouchableOpacity>
              )}
              {!isAdmin && (
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buttonTextBuy}>Mua ngay</Text>
                </TouchableOpacity>
              )}
                            {isAdmin && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteVaccine}>
                  <Text style={styles.buttonTextDelete}>Xóa vắc xin</Text>
                </TouchableOpacity>
              )}
            </View>
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
  tag: {
    backgroundColor: COLORS.green,
    color: COLORS.white,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    flex: 1,
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buyButton: {
    flex: 1,
    borderColor: COLORS.blue,
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonTextBuy: {
    color: COLORS.blue,
  },
  buttonTextAdd: {
    color: COLORS.white,
    width: '80%',
    alignItems: 'center'
  },
  buttonTextDelete: {
    color: COLORS.white,
    width: '80%',
    textAlign: 'center'

  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.red,
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default DetailVaccines;

