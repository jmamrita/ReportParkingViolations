import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

export const CustomButton = ({ onPress, title, containerStyle }) => (
  <View style={containerStyle ?? styles.containerStyle}>
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: "50%",
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
