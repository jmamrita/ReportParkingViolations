import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const CustomDropdown = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option);
  };

  return (
    <View style={{ marginHorizontal: 26 }}>
      <Text>Choose a parking violation</Text>
      <TouchableOpacity
        onPress={() => setShowOptions(!showOptions)}
        style={{
          borderWidth: 1,
          borderRadius: 5,
          flexDirection: "row",
          height: 44,
          padding: 10,
          justifyContent: "space-between",
        }}
      >
        <Text>{selectedOption || "Select a parking violation"}</Text>
        <MaterialIcons
          name={showOptions ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
        />
      </TouchableOpacity>
      {showOptions && (
        <View style={{ borderWidth: 1, borderRadius: 5, marginHorizontal: 26 }}>
          {options.map((option, index) => (
            <TouchableOpacity
              style={{ margin: 10 }}
              key={index}
              onPress={() => handleSelect(option)}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
