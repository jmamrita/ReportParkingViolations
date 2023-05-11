import { StyleSheet, View, Text, TextInput } from "react-native";
import React, { useState } from "react";

export const InputField = ({ placeholder, inputValue, label }) => {
  return (
    <View style={{ margin: 12 }}>
      <Text>{label}</Text>
      <TextInput
        style={styles.input}
        value={inputValue}
        placeholder={placeholder}
      />
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
