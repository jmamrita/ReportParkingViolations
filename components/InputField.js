import { StyleSheet, View, Text, TextInput } from "react-native";
import React from "react";

export const InputField = ({
  placeholder,
  label,
  inputValue,
  onChange,
  multiline,
}) => {
  return (
    <View style={{ margin: 12 }}>
      <Text style={{ marginBottom: 10 }}>{label}</Text>
      <TextInput
        style={[styles.input, { height: multiline ? 88 : 44 }]}
        placeholder={placeholder}
        value={inputValue}
        onChangeText={onChange}
        selectionColor={"black"}
        multiline={multiline}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
