import { StyleSheet, View, Text, TextInput } from "react-native";
import React, { useState } from "react";

export const InputField = ({ placeholder, inputValue, label }) => {
  return (
    <View>
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
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
