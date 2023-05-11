import { StyleSheet, View, Text, TextInput } from "react-native";
import React from "react";

export const InputField = ({ placeholder, label }) => {
  return (
    <View style={{ margin: 12 }}>
      <Text style={{ marginBottom: 10 }}>{label}</Text>
      <TextInput style={styles.input} placeholder={placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
