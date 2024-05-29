import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Platform,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

const UpdateVaccines = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, title = '', price = 0, imageUrl = '', description = '', origin = '', usage = '' } = route.params || {};

  const [vaccine, setVaccine] = useState(title);
  const [vaccineError, setVaccineError] = useState('');
  const [priceState, setPrice] = useState(price.toString());
  const [priceError, setPriceError] = useState('');
  const [usageState, setUsage] = useState(usage);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(imageUrl);
  const [descriptionState, setDescription] = useState(description);
  const [originState, setOrigin] = useState(origin);
  const [isLoading, setIsLoading] = useState(false); 

  const ref = firestore().collection('vaccines');
  const origins = ['USA', 'China', 'India', 'Russia', 'UK', 'Bỉ'];
  const usages = [
    'Miệng',
    'Tiêm',
    'Nhỏ giọt',
    'Hít vào',
    'Đường uống',
    'Tiêm bắp',
    'Tiêm trong da',
  ];

  useEffect(() => {
    setVaccine(title);
    setPrice(price.toString());
    setUsage(usage);
    setImageUri(imageUrl);
    setDescription(description);
    setOrigin(origin);
  }, [title, price, imageUrl, description, origin, usage]);

  async function updateVaccine() {
    setIsLoading(true); 

    if (vaccine.trim() === '') {
      setVaccineError('Chưa nhập vắc xin');
      setIsLoading(false); 
      return;
    } else {
      setVaccineError('');
    }
  
    if (isNaN(parseFloat(priceState))) {
      setPriceError('Chưa nhập giá tiền.');
      setIsLoading(false); 
      return;
    } else {
      setPriceError('');
    }
  
    let imageUrlUpdated = imageUri;
    if (imageUri && imageUri !== imageUrl) {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
      const task = storage().ref(filename).putFile(uploadUri);
  
      try {
        await task;
        imageUrlUpdated = await storage().ref(filename).getDownloadURL();
      } catch (e) {
        console.error('Failed to upload image', e);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
        setIsLoading(false); 
        return;
      }
    }
  
    ref
      .doc(id)
      .update({
        title: vaccine,
        price: parseFloat(priceState),
        imageUrl: imageUrlUpdated,
        description: descriptionState,
        origin: originState,
        usage: usageState,
      })
      .then(() => {
        console.log('Vaccine updated successfully');
        showMessage({
          message: 'Thông báo',
          description: 'Cập nhật thành công',
          type: 'success',
          floating: true, 
          autoHide: true, 
          duration: 3000,
        });
        navigation.navigate('ListVaccin');
      })
      .catch((error) => {
        console.error('Failed to update vaccine', error);
        Alert.alert('Error', 'Failed to update vaccine. Please try again.');
      })
      .finally(() => {
        setIsLoading(false); 
      });
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.label}>Vaccine:</Text>
        <TextInput
          style={styles.input}
          value={vaccine}
          onChangeText={(text) => setVaccine(text)}
        />
        {vaccineError ? <Text style={styles.error}>{vaccineError}</Text> : null}
  
        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          value={priceState}
          keyboardType="numeric"
          onChangeText={(text) => setPrice(text)}
        />
        {priceError ? <Text style={styles.error}>{priceError}</Text> : null}
  
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={descriptionState}
          onChangeText={(text) => setDescription(text)}
        />
  
        <Text style={styles.label}>Origin:</Text>
        <Picker
          selectedValue={originState}
          onValueChange={(itemValue) => setOrigin(itemValue)}
          style={styles.picker}
        >
          {origins.map((origin) => (
            <Picker.Item key={origin} label={origin} value={origin} />
          ))}
        </Picker>
  
        <Text style={styles.label}>Usage:</Text>
        <Picker
          selectedValue={usageState}
          onValueChange={(itemValue) => setUsage(itemValue)}
          style={styles.picker}
        >
          {usages.map((usage) => (
            <Picker.Item key={usage} label={usage} value={usage} />
          ))}
        </Picker>
  
        <Button title="Select Image" onPress={() => launchImageLibrary({}, (response) => {
          if (response.assets) {
            setImageUri(response.assets[0].uri);
          }
        })} />
  
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
  
        <Button title="Update Vaccine" onPress={updateVaccine} disabled={loading || isLoading} />
  
      
        {isLoading && (
          <View style={styles.loadingContainer}>
            <LottieView
              style={{ width: 100, height: 100 }} 
              source={require('../../../theme/Loading/loadingdot.json')}
              autoPlay
              loop
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView:
  {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 20,
  },
  error: {
    color: 'red',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex:1,
  },
});

export default UpdateVaccines;
