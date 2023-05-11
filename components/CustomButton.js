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
    padding: 10,
    borderRadius: 5,
    minWidth: "50%",
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
