import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";

export const ImageView = ({ label, source }) => {
  return (
    <View>
      <Text style={styles.text}>{label}</Text>
      <ImageBackground source={{ uri: source }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
