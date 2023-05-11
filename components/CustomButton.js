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
    backgroundColor: "#6495ED",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    alignSelf: "flex-start",
  },
});
