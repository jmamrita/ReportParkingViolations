import React from "react";
import { Camera } from "expo-camera";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { CustomButton } from "./CustomButton";

export const CameraScreen = ({ cameraRef, onShutterPress }) => (
  <Camera style={styles.container} ref={cameraRef}>
    <View style={styles.buttonContainer}>
      <CustomButton title="Take a Pic" onPress={onShutterPress} />
    </View>
    <StatusBar style="auto" />
  </Camera>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {},
});
