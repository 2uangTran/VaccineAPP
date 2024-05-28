import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 
import COLORS from '../../theme/constants';

const Info = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userEmail = currentUser.email; 
          const userDoc = await firestore().collection('USERS').where('email', '==', userEmail).get();
          if (!userDoc.empty) {
            userDoc.forEach(doc => {
              setUserInfo(doc.data());
            });
          } else {
            console.log("User document not found");
          }
        } else {
          console.log("No user is currently signed in");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : userInfo ? (
          <View style={styles.infoBox}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Họ và tên</Text>
              <Text style={styles.infoText}>{userInfo.fullName}</Text>
              <View style={styles.separator} />
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Số điện thoại</Text>
              <Text style={styles.infoText}>{userInfo.phone}</Text>
              <View style={styles.separator} />
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Ngày sinh</Text>
              <Text style={styles.infoText}>{userInfo.birthDate}</Text>
              <View style={styles.separator} />
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Giới tính</Text>
              <Text style={styles.infoText}>{userInfo.gender}</Text>
              <View style={styles.separator} />
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Địa chỉ</Text>
              <Text style={styles.infoText}>{userInfo.address}, {userInfo.ward}, {userInfo.district}, {userInfo.province}</Text>
              <View style={styles.separator} />
            </View>
          </View>
        ) : (
          <Text>Thông tin người dùng không khả dụng</Text>
        )}
      </ScrollView>
      <TouchableOpacity  style={styles.buttonchoose}>
             <Text style={styles.ButtonTextChoose}>Chọn người tiêm</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  contentContainer: {
    padding: 16,
  },
  infoBox: {
    borderColor: COLORS.gray,
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  infoBlock: {
    marginBottom: 16,
  },
  infoLabel: {
    fontWeight: 'bold',
    paddingRight: 5,
    fontSize: 17,
    color: COLORS.grey,
  },
  infoText: {
    fontSize: 21,
    color: COLORS.black,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.grey,
    marginVertical: 8,
    width:'100%'
  },
  buttonchoose:{
    width: '80%',
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'center', 
    marginTop: 20, 
    marginBottom:50,
  },
  ButtonTextChoose:{
    color:COLORS.white,
    fontSize:17,
  }
});

export default Info;
