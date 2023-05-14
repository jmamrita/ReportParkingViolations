import React, { useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { StyleSheet, View, Pressable, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

export const CameraScreen = ({ cameraRef, onShutterPress }) => {
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [type, setType] = useState(CameraType.back);
  return (
    <>
      <View
        style={{
          justifyContent: "space-between",
          height: useWindowDimensions().height,
        }}
      >
        <Camera
          flashMode={flash}
          style={{
            justifyContent: "center",
            alignContent: "center",
            height: useWindowDimensions().height * 0.85,
          }}
          type={type}
          ref={cameraRef}
        ></Camera>
        <View
          style={{
            backgroundColor: "black",
            height: useWindowDimensions().height * 0.15,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() =>
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              )
            }
          >
            <MaterialIcons
              name={"flip-camera-ios"}
              size={60}
              color={"white"}
              style={{ margin: 20 }}
            />
          </Pressable>
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
          <Pressable
            onPress={() =>
              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.torch
                  : Camera.Constants.FlashMode.off
              )
            }
          >
            <MaterialIcons
              name={
                flash === Camera.Constants.FlashMode.off
                  ? "flash-on"
                  : "flash-off"
              }
              size={60}
              color={"white"}
              style={{ marginTop: 25 }}
            />
          </Pressable>
        </View>
      </View>
      <StatusBar style="auto" />
    </>
  );
};

const styles = StyleSheet.create({});
