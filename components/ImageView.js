import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";

export const ImageView = ({ label, source }) => {
  return (
    <View>
      <Text>{label}</Text>
      <ImageBackground source={{ uri: source }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});
