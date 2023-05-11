import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const CustomDropdown = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowOptions(!showOptions)}
        style={{ borderWidth: 1, borderRadius: 5 }}
      >
        <Text>{selectedOption || "Select a violation"}</Text>
        <Image />
      </TouchableOpacity>
      {showOptions && (
        <View>
          {options.map((option) => (
            <TouchableOpacity key={option} onPress={() => handleSelect(option)}>
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
