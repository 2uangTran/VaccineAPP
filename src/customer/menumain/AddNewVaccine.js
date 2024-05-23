import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, Image, Platform} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const AddNewVaccine = () => {
  const [vaccine, setVaccine] = useState('');
  const [vaccineError, setVaccineError] = useState('');
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const ref = firestore().collection('vaccines');
  const [vaccines, setVaccines] = useState([]);
  async function addVaccine() {
    if (vaccine.trim() === '') {
      setVaccineError('Chưa nhập vắc xin');
      return;
    } else {
      setVaccineError('');
    }

    if (isNaN(parseFloat(price))) {
      setPriceError('Chưa nhập giá tiền.');
      return;
    } else {
      setPriceError('');
    }

    let imageUrl = '';
    if (imageUri) {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
      const task = storage().ref(filename).putFile(uploadUri);

      try {
        await task;
        imageUrl = await storage().ref(filename).getDownloadURL();
      } catch (e) {
        console.error(e);
      }
    }

    const newVaccine = {
      title: vaccine,
      price: parseFloat(price),
      imageUrl,
      description, // Adding description to the vaccine object
    };

    ref.add(newVaccine);

    setVaccine('');
    setPrice('');
    setImageUri(null);
    setDescription(''); // Resetting description
  }

  const selectImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, price, imageUrl, description} = doc.data(); // Including description
        list.push({
          id: doc.id,
          title,
          price,
          imageUrl,
          description, // Including description
        });
      });
      setVaccines(list);

      if (loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <View>
      <Text>Thêm mới vắc xin</Text>
      <TextInput
        placeholder="Tên vắc xin"
        value={vaccine}
        onChangeText={setVaccine}
      />
      {vaccineError ? <Text>{vaccineError}</Text> : null}
      <TextInput
        placeholder="Giá tiền"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      {priceError ? <Text>{priceError}</Text> : null}
      <TextInput
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Chọn ảnh" onPress={selectImage} />
      {imageUri ? (
        <Image source={{uri: imageUri}} style={{width: 100, height: 100}} />
      ) : null}
      <Button title="Thêm vắc xin" onPress={addVaccine} />
    </View>
  );
};

export default AddNewVaccine;
