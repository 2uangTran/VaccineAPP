import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Appbar } from 'react-native-paper';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../theme/constants';
import auth from '@react-native-firebase/auth';

const TopButton = ({ title, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {title}
      </Text>
      {isSelected && <View style={styles.selectedIndicator} />}
    </TouchableOpacity>
  );
};

const Schedule = ({ navigation }) => {
  const [selectedButton, setSelectedButton] = useState('Đã lên lịch');
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = auth().currentUser;
  
  useEffect(() => {
    fetchBills();
  }, [selectedButton]);

  const handlePress = (button) => {
    console.log(button + ' pressed');
    setSelectedButton(button);
  };

  const handleDetailPress = (orderId) => {
    navigation.navigate('DetailBuy', { orderId });
  };

  const fetchBills = async () => {
    setLoading(true);
    try {
      const currentUserEmail = currentUser.email;
      let billsCollection = firestore().collection('bills');

      if (selectedButton === 'Chưa hoàn tất') {
        billsCollection = billsCollection.where('paymentStatus', 'in', [0, 3]);
      } else if (selectedButton === 'Đã lên lịch') {
        billsCollection = billsCollection.where('paymentStatus', '==', 1);
      } else if (selectedButton === 'Đề xuất') {
        // Logic for fetching "Đề xuất" items (if different)
      }

      const billsSnapshot = await billsCollection.where('email', '==', currentUserEmail).get();
      
      const billsList = [];
      billsSnapshot.forEach(doc => {
        const vaccineArray = doc.data().vaccine;
        const title = vaccineArray.length > 0 ? vaccineArray[0].title : "Unknown Vaccine";
        const center = doc.data().center ? doc.data().center : "Unknown Center";
        
        const billData = {
          id: doc.id,
          vaccinationDate: doc.data().vaccinationDate,
          fullName: doc.data().fullName,
          title: title,
          center: center,
          paymentStatus: doc.data().paymentStatus,
        };
        billsList.push(billData);
      });
      setBills(billsList);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <FontAwesome6 name="table-list" size={100} color={COLORS.gray} />
      <Text style={styles.emptyListText}>Danh sách trống</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header style={styles.appbar}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Lịch hẹn</Text>
        </View>
      </Appbar.Header>
      <View style={styles.buttonContainer}>
        <TopButton
          title="Đã lên lịch"
          onPress={() => handlePress('Đã lên lịch')}
          isSelected={selectedButton === 'Đã lên lịch'}
        />
        <TopButton
          title="Chưa hoàn tất"
          onPress={() => handlePress('Chưa hoàn tất')}
          isSelected={selectedButton === 'Chưa hoàn tất'}
        />
        <TopButton
          title="Đề xuất"
          onPress={() => handlePress('Đề xuất')}
          isSelected={selectedButton === 'Đề xuất'}
        />
      </View>
      <View style={{ flex: 1 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          bills.length === 0 ? (
            renderEmptyList()
          ) : (
            <FlatList
              data={bills}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.billContainer} onPress={() => handleDetailPress(item.id)}>
                  <View style={styles.billRow}>
                    <View style={[styles.billColumn, styles.leftColumn]}>
                      <Text style={styles.billText}>{`${item.vaccinationDate}`}</Text>
                      <Text style={styles.billText}>{`${item.fullName}`}</Text>
                    </View>
                    <View style={[styles.billColumn, styles.rightColumn]}>
                      <Text style={styles.billTextWrap}>{`${item.title}`}</Text>
                      <Text style={styles.billText}>{`${item.center}`}</Text>
                      <Text style={[
                        styles.billText, 
                        {
                          color: item.paymentStatus === 0 ? 'orange' :
                                item.paymentStatus === 3 ? 'red' :
                                'green'
                        }
                      ]}>
                        {`${item.paymentStatus === 0 ? 'Chờ thanh toán' : item.paymentStatus === 3 ? 'Đã hủy' : 'Đã thanh toán'}`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default Schedule;

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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textSelected: {
    color: 'blue',
  },
  selectedIndicator: {
    width: '100%',
    height: 3,
    backgroundColor: 'blue',
    marginTop: 5,
  },
  billContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom:  5, 
  },
  billColumn: {
    flex: 1,
  },
  leftColumn: {
    marginRight: 10, 
  },
  rightColumn: {
    marginLeft: 10, 
  },
  billText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  billTextWrap: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    flexWrap: 'wrap',
    width: 150, 
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    color: '#CCCCCC',
    marginTop: 10,
    width: '100%',
    textAlign: 'center'
  },
});

