import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Centers = ({ onSelect }) => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const centersCollection = await firestore().collection('CENTERS').get();
        const centersData = centersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCenters(centersData);
      } catch (error) {
        console.error("Error fetching centers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const renderCenterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.centerItem}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.centerName}>{item.name}</Text>
      <Text style={styles.centerAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={centers}
          renderItem={renderCenterItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centerItem: {
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  centerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black'
  },
  centerAddress: {
    fontSize: 14,
    color: '#666',
  },
});

export default Centers;
