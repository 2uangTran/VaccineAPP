import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../theme/constants';
import {useMyContextController} from '../../context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';

const Record = ({id, title, imageUrl, center}) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [controller] = useMyContextController();
  const {userLogin} = controller;
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;
          const userDoc = await firestore()
            .collection('USERS')
            .where('email', '==', userEmail)
            .get();
          if (!userDoc.empty) {
            userDoc.forEach(doc => {
              setUserInfo(doc.data());
            });
          } else {
            console.log('User document not found');
          }
        } else {
          console.log('No user is currently signed in');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri: userInfo?.avatarUrl || 'https://via.placeholder.com/50',
            }}
            style={styles.userImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo?.fullName}</Text>
            <Text style={styles.centerText}>{center}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DetailRecord', {
              id,
              title,
              imageUrl,
              center,
            });
          }}>
          <Text style={styles.postText}>{title}</Text>
          <Image source={{uri: imageUrl}} style={styles.postImage} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginBottom: 10,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  centerText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  postText: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default Record;
