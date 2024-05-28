import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 
import COLORS from '../../theme/constants';
import { useNavigation } from '@react-navigation/native';

const Info = () => {
  const navigation = useNavigation();
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

  const Victim = () => {
    navigation.navigate('InfoVictim')
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : userInfo ? (
          <View style={styles.infoBox}>
            <InfoItem label="Họ và tên" value={userInfo.fullName} />
            <InfoItem label="Số điện thoại" value={userInfo.phone} />
            <InfoItem label="Ngày sinh" value={userInfo.birthDate} />
            <InfoItem label="Giới tính" value={userInfo.gender} />
            <InfoItem label="Địa chỉ" value={`${userInfo.address}, ${userInfo.ward}, ${userInfo.district}, ${userInfo.province}`} numberOfLines={2} />
          </View>
        ) : (
          <Text>Thông tin người dùng không khả dụng</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.buttonchoose} onPress={Victim}>
        <Text style={styles.ButtonTextChoose}>Chọn người tiêm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const InfoItem = ({ label, value, numberOfLines = 1 }) => (
  <View style={styles.infoBlock}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text numberOfLines={numberOfLines} ellipsizeMode="tail" style={styles.infoText}>{value}</Text>
    <View style={styles.separator} />
  </View>
);

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  infoBox: {
    borderColor: COLORS.gray,
    padding: 5,
    marginBottom: 50, 
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
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.grey,
    marginVertical: 8,
  },
  buttonchoose: {
    width: '80%',
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  ButtonTextChoose: {
    color: COLORS.white,
    fontSize: 17,
  }
});

export default Info;
