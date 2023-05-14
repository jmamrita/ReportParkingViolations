import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const CustomButton = ({
  onPress,
  title,
  containerStyle,
  disabled,
  buttonColor,
  iconName,
}) => (
  <View style={containerStyle ?? styles.containerStyle}>
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: disabled ? "#E5E4E2" : buttonColor ?? "#6495ED",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
      }}
      disabled={disabled}
    >
      <View style={{ flexDirection: "row" }}>
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={20}
            color={"white"}
            style={{ marginRight: 2 }}
          />
        )}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    alignSelf: "flex-start",
  },
});
