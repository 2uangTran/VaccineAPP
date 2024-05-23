import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useMyContextController, logout } from '../../src/context'; 
import COLORS from '../../constants';
import ListVaccin from './menumain/ListVaccin';

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const navigation = useNavigation();
  const ref = firestore().collection('USERS');
 
  useState(() => {
    return ref.onSnapshot(querySnapshot => {
      if (loading) {
        setLoading(false);
      }
    });
  });

  if (loading) {
    return null;
  }

  const getCurrentTimeMessage = () => {
    const currentTime = new Date().getHours();
    const greeting = getGreeting(currentTime);
    const userName = userLogin ? userLogin.fullName : 'Guest';
  
    return (
      <>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.userName}>{userName}</Text>
      </>
    );
  };
  
  const getGreeting = (currentTime) => {
    if (currentTime >= 0 && currentTime < 12) {
      return `Chào buổi sáng,`;
    } else if (currentTime >= 12 && currentTime < 14) {
      return `Chào buổi trưa,`;
    } else if (currentTime >= 14 && currentTime < 17) {
      return `Chào buổi chiều,`;
    } else {
      return `Chào buổi tối,`;
    }
  };

  const splitDescription = (description) => {
    let words = description.split(' ');
    let result = [];

    for (let i = 0; i < words.length; i += 2) {
      if (i === words.length - 1) {
        if (result.length > 0) {
          result[result.length - 1] += ` ${words[i]}`;
        } else {
          result.push(words[i]);
        }
      } else {
        result.push(`${words[i]} ${words[i + 1]}`);
      }
    }

    return result;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action 
            icon={() => <MaterialCommunityIcons name="bell-outline" size={24} color="white" />} 
            onPress={() => {}} 
          />
          <View style={styles.greetingContainer}>
            {getCurrentTimeMessage()}
          </View>
          <View style={styles.spacer} />
        </Appbar.Header>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.squareButton}>
                <FontAwesome6
                  name="syringe"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {splitDescription("Đặt mua vắc xin").map((part, index) => (
                <Text key={index} style={styles.buttonText}>{part}</Text>
              ))}
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('ListVaccin')}>
                <AntDesign
                  name="appstore-o"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {splitDescription("Danh mục vắc xin").map((part, index) => (
                <Text key={index} style={styles.buttonText}>{part}</Text>
              ))}
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.squareButton}>
                <FontAwesome6
                  name="book-bookmark"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {splitDescription("Lịch sử tiêm chủng").map((part, index) => (
                <Text key={index} style={styles.buttonText}>{part}</Text>
              ))}
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.squareButton}>
                <FontAwesome6
                  name="book-medical"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {splitDescription("Lịch sử đặt vắc xin").map((part, index) => (
                <Text key={index} style={styles.buttonText}>{part}</Text>
              ))}
            </View>
          </View>
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.squareButton}>
                <AntDesign
                  name="gift"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {splitDescription("Ưu đãi của tôi").map((part, index) => (
                <Text key={index} style={styles.buttonText}>{part}</Text>
              ))}
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.squareButton}>
                <MaterialCommunityIcons
                  name="clock"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {splitDescription("Nhật ký tiêm chủng").map((part, index) => (
                <Text key={index} style={styles.buttonText}>{part}</Text>
              ))}
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.squareButton}>
                <MaterialCommunityIcons
                  name="test-tube"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {splitDescription("Vắc xin cho bạn").map((part, index) => (
                <Text key={index} style={styles.buttonText}>{part}</Text>
              ))}
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.squareButton}>
                <FontAwesome6
                  name="newspaper"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {splitDescription("Tin tức vắc xin").map((part, index) => (
                <Text key={index} style={styles.buttonText}>{part}</Text>
              ))}
            </View>
          </View>
        </View>
        <View >
          <Text style={styles.news}>Tin tức và Kiến thức</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buttonScroll}>
          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Vắc xin người lớn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Vắc xin trẻ em</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Bệnh truyền nhiễm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Lịch tiêm chủng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Thông tin ưu đãi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Cẩm nang tiêm chủng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Thông tin khai trương</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whiteButton}>
            <Text style={styles.whiteButtonText}>Tin tức và kiến thức</Text>
          </TouchableOpacity>
        </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    backgroundColor: COLORS.blue,
    height: '24%', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height:150,
    marginTop:30,
    marginStart:-10,
  },
  spacer: {
    width: 24,
  },
  greeting: {
    fontSize: 17,
    color: COLORS.white,
  },
  userName: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonWrapper: {
    alignItems: 'center',
    width: 80,
  },
  squareButton: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  newsContainer: {
    marginTop: 20,
    marginLeft: 10,
  },
  news: {
    fontSize: 24,
    color: COLORS.black,
  },
  buttonScroll: {
    marginTop: 10,
  },
  whiteButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  whiteButtonText: {
    color: COLORS.black,
    fontSize: 16,
  },
});

export default Main;
