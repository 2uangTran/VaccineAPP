import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../theme/constants';
import {Image} from 'react-native-elements';
import {Appbar} from 'react-native-paper';

const ConfirmationScreen = ({route}) => {
  const navigation = useNavigation();
  const {orderDetails} = route.params;

  const fullName = orderDetails.fullname;
  const [name, dob] = fullName.split('-');

  const handleDetailPress = () => {
    navigation.navigate('DetailBuy', {
      orderId: orderDetails.orderId,
      readOnly: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Xác nhận" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://lucngoc.com/wp-content/uploads/2023/11/facebook-verified-badge-01-640x640.jpg',
            }}
            style={styles.image}
          />
        </View>
        <Text style={styles.title}>Đặt giữ vắc xin thành công</Text>
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Mã đặt mua:</Text>
            <Text style={styles.info}>{orderDetails.orderId}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Người tiêm:</Text>
            <View>
              <Text style={styles.info}>{name.trim()}</Text>
              <Text style={styles.info}>{dob.trim()}</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Số tiền cần thanh toán:</Text>
            <Text style={styles.info}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(orderDetails.totalPrice)}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Hạn thanh toán:</Text>
            <Text style={styles.info}>{orderDetails.vaccinationDate}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Trạng thái thanh toán:</Text>
            <Text
              style={[
                styles.info,
                orderDetails.paymentStatus === 0
                  ? {color: '#FFCC00'}
                  : orderDetails.paymentStatus === 1
                  ? {color: 'green'}
                  : {color: 'red'},
              ]}>
              {orderDetails.paymentStatus === 0
                ? 'Chờ thanh toán'
                : orderDetails.paymentStatus === 1
                ? 'Đã thanh toán'
                : 'Đã hủy'}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.detailLink} onPress={handleDetailPress}>
            Xem chi tiết đơn hàng
          </Text>
        </TouchableOpacity>
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            <Text style={{textDecorationLine: 'underline', fontSize: 16}}>
              Lưu ý:
            </Text>
            Nếu quý khách không nhận được tin nhắn xác nhận đã thanh toán trong
            vòng 48 giờ (Không tính thứ 7, chủ nhật) sau khi hoàn tất quá trình
            chuyển khoản, vui lòng liên hệ
            <Text style={{color: '#FFCC00'}}> hotline 028 7102 6595</Text> để
            được hỗ trợ.
          </Text>
        </View>
        <Text style={styles.thankYouText}>
          Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}>
          <Text style={styles.buttonText}>Về lại trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    width: '100%',
  },
  appbar: {
    backgroundColor: COLORS.blue,
    width: '100%',
  },
  appbarTitle: {
    textAlign: 'center',
    color: COLORS.white,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.grey,
    width: '90%',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 23,
    color: COLORS.black,
    textAlign: 'center',
    padding: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.grey,
    padding: 10,
    width: '40%',
  },
  info: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    padding: 10,
  },
  detailLink: {
    paddingTop: 10,
    textAlign: 'center',
    color: COLORS.blue,
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  noteContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  noteText: {
    textAlign: 'center',
    color: COLORS.black,
    fontSize: 16,
  },
  thankYouText: {
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});

export default ConfirmationScreen;
