import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 
import COLORS from '../theme/constants';
import Entypo from 'react-native-vector-icons/Entypo';

const Vaccine = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

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

  const handleUserInfoPress = () => {
    navigation.navigate('Info');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Appbar.Header style={styles.appbar}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Đăng ký tiêm vắc xin</Text>
        </View>
      </Appbar.Header>
      <View style={styles.userInfoContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : userInfo ? (
          <TouchableOpacity style={styles.userInfoBox} onPress={handleUserInfoPress}>
            <View style={styles.userImageContainer}>
              <View style={styles.userImageWrapper}>
              {userInfo.avatarUrl ? (
              <Image source={{ uri: userInfo.avatarUrl }} style={styles.userImage} />
              ) : (
                <Image source={require('../theme/image/images.png')} style={styles.userImage} />
              )}
              
              </View>
            </View>
            <View style={styles.userInfoTextContainer}>
              <Text style={styles.userInfoTextName}>{userInfo.fullName}</Text>
              <Text style={styles.userInfoText}>{userInfo.phoneNumber}</Text>
              <Text style={styles.userInfoText}>{userInfo.birthDate}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Entypo name="chevron-right" size={24} color="black" />
            </View>
          </TouchableOpacity>        
        ) : (
          <Text>User information not available</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingRight:20,
    padding: 4,
    width: '100%'
  },
  userInfoBox: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImageContainer: {
    marginRight: 20,
  },
  userImageWrapper: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  userInfoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userInfoText: {
    color: COLORS.black,
    fontSize: 16,
    marginBottom: 10,
  },
  userInfoTextName: {
    color: COLORS.black,
    fontSize: 16,
    marginBottom: 10,
    fontWeight:'bold'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Vaccine;
