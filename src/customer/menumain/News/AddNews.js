import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  // Button,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import COLORS from '../../../theme/constants';
import {ScrollView} from 'react-native-gesture-handler';

const AddNews = () => {
  const [newss, setNewss] = useState('');
  const [newsError, setNewsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const ref = firestore().collection('News');
  const [news, setNewsList] = useState([]);

  async function addNews() {
    if (newss.trim() === '') {
      setNewsError('Chưa nhập vắc xin');
      return;
    } else {
      setNewsError('');
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

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const newNews = {
      title: newss,
      imageUrl,
      description,
      date: formattedDate,
    };

    ref.add(newNews);
    setNewss('');
    setImageUri(null);
    setDescription('');
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
        const {title, imageUrl, description} = doc.data();
        list.push({
          id: doc.id,
          title,
          imageUrl,
          description,
        });
      });
      setNewsList(list);

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
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Tiêu đề tin tức</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            // placeholder="tiêu đề"
            value={newss}
            onChangeText={setNewss}
          />
          {newsError ? <Text style={styles.errorText}>{newsError}</Text> : null}
        </View>

        <Text style={styles.title}>Nội dung</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            // placeholder="nội dung"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Button
            buttonStyle={styles.btn}
            title="Chọn ảnh"
            onPress={selectImage}
            icon={
              <Icon
                name="image"
                type="font-awesome"
                size={20}
                color="white"
                style={{marginRight: 10}}
              />
            }
            iconLeft
          />
          {imageUri ? (
            <Image source={{uri: imageUri}} style={styles.image} />
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <Button title="Thêm tin tức" onPress={addNews} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: COLORS.orange,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
    borderColor: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    padding: 10,
    height: 50,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 20,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default AddNews;
