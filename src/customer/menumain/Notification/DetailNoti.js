import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DetailNoti = ({ route }) => {
  const { id } = route.params;
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Notification')
      .doc(id)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setNotification(documentSnapshot.data());
        }
      });
  
    return () => unsubscribe();
  }, [id]);
  
  console.log('Notification:', notification);
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
      {notification && notification.imageUrl && (
          <Image
            source={{ uri: notification.imageUrl }}
            style={styles.image}
          />
        )}


        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{notification?.title}</Text>
          <Text style={styles.description}>{notification?.description}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 10,
    alignItems: 'center', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center', 
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center', 
  },
});


export default DetailNoti;
