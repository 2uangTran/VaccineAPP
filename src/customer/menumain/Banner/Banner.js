import React from 'react';
import {useWindowDimensions, View, Text, StyleSheet, Image} from 'react-native';

export default Banner = ({item}) => {
  const {width} = useWindowDimensions();
  return (
    <View style={[styles.container, {width}]}>
      <Image
        source={item.image}
        style={[styles.image, {width, resizeMode: 'contain'}]}
      />
      <View style={{flex: 0.3}}></View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
    borderRadius: 50,
  },
});
