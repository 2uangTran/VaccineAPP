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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <Image
          source={notification?.imageUrl ? { uri: notification.imageUrl } : null}
          style={styles.image}
        />
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
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
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
    alignItems: 'center', // Center horizontally within the card
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 10,
    alignItems: 'center', // Center horizontally within the details container
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center', // Center text horizontally
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center', // Center text horizontally
  },
});


export default DetailNoti;
