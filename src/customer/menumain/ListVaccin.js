import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { Appbar } from 'react-native-paper'; 
import COLORS from '../../../constants'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ListVaccin = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
            <View style={styles.searchContainer}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={24}
                  color={COLORS.white}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm theo tên gói, tên vắc xin,..."
                  placeholderTextColor={COLORS.white}
                />
              </View>
            </Appbar.Header>
         
            <View style={styles.content}>
                <Text>List of Vaccines will be displayed here.</Text>
            </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        appbar: {
          backgroundColor: COLORS.blue,
          justifyContent: 'center',
        },
        searchContainer: {
          width:370,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.navy,
          borderColor: COLORS.white,
          borderWidth: 1,
          borderRadius: 5,
          paddingHorizontal: 10,
        },
        searchIcon: {
          marginRight: 10,
        },
        searchInput: {
          flex: 1,
          height: 40,
          color: COLORS.white,
        },
        content: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
    });

export default ListVaccin;
