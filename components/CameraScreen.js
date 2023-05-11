import React from "react";
import { Camera } from "expo-camera";
import { StyleSheet, View, Pressable, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

export const CameraScreen = ({ cameraRef, onShutterPress }) => (
  <>
    <Camera
      style={{
        justifyContent: "center",
        alignContent: "center",
        height: useWindowDimensions().height / 1.35,
      }}
      ref={cameraRef}
    ></Camera>
    <View style={{ backgroundColor: "black", height: 100 }}>
      <View
        style={{
          backgroundColor: "black",
          height: 70,
          width: 70,
          borderRadius: 35,
          borderColor: "white",
          borderWidth: 2,
          alignSelf: "center",
          margin: 10,
        }}
      >
        <Pressable
          onPress={onShutterPress}
          style={{
            backgroundColor: "white",
            height: 50,
            width: 50,
            borderRadius: 25,
            margin: 8,
          }}
        />
      </View>
    </View>
    <StatusBar style="auto" />
  </>
);

const styles = StyleSheet.create({});
