import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const CustomDropdown = ({ options, onSelect, clear }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (option) => {
    clear = false;
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option);
  };

  return (
    <View style={{ marginHorizontal: 12 }}>
      <Text style={{ marginBottom: 10 }}>Choose a parking violation</Text>
      <TouchableOpacity
        onPress={() => setShowOptions(!showOptions)}
        style={{
          borderWidth: 1,
          borderBottomLeftRadius: showOptions ? 0 : 5,
          borderBottomRightRadius: showOptions ? 0 : 5,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          flexDirection: "row",
          height: 44,
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ textAlign: "center", paddingVertical: 12 }}>
          {clear
            ? "Select a parking violation"
            : selectedOption || "Select a parking violation"}
        </Text>
        <MaterialIcons
          name={showOptions ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          style={{ paddingVertical: 9 }}
        />
      </TouchableOpacity>
      {showOptions && (
        <ScrollView
          showsVerticalScrollIndicator
          nestedScrollEnabled={true}
          style={{
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            height: 200,
          }}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              style={{ margin: 10 }}
              key={index}
              onPress={() => handleSelect(option)}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
