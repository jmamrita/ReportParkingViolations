import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Alert, TextInput } from "react-native";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import {
  CameraScreen,
  CustomButton,
  ImageView,
  InputField,
  CustomDropdown,
} from "./components";
import { violationOptions } from "./constants";

export default function App() {
  let licensePlate = "";
  let violationDescription = "";
  const [violation, setViolation] = useState();

  // Camera related code
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [isCameraOpen, setIsCameraOpen] = useState();
  let cameraRef = useRef();
  const takeImage = async () => {
    if (!hasCameraPermission) {
      Alert.alert("You don't have permission to launch camera");
      return;
    }
    setIsCameraOpen(true);
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    type === "vehicle"
      ? setVehiclePhoto(newPhoto.uri)
      : setLicensePhoto(newPhoto.uri);
    setIsCameraOpen(false);
  };

  // Media library related code
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const pickImage = async () => {
    if (!hasMediaLibraryPermission) {
      Alert.alert("You don't have permission to open gallery");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      type === "vehicle"
        ? setVehiclePhoto(result.assets[0].uri)
        : setLicensePhoto(result.assets[0].uri);
    }
  };
  const handleSelect = (option) => {
    setViolation(option);
  };
  // const [data, setData] = useState();
  // const fetchData = () => {
  //   fetch(
  //     "https://dwp-nonprod.azure-api.net/smartparking/v1.0/vehicle/region/1/registration/admin?license=",
  //     {
  //       headers: {
  //         "SmartParking-Apim-Subscription-Key":
  //           "296b3ec4113047c0922a3b2f6a282a4e",
  //         Authorization: "",
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((json) => setData(json))
  //     .catch((error) => console.error(error));
  //   console.log("HERE IS  THE RESULT");
  // };

  // Set photos related code
  const [type, setType] = useState();
  const [licensePhoto, setLicensePhoto] = useState();
  const [vehiclePhoto, setVehiclePhoto] = useState();

  const openAlert = () => {
    Alert.alert(`Add a ${type} photo`, "Choose from the options below", [
      {
        text: "Take a pic",
        onPress: takeImage,
      },
      {
        text: "Upload from gallery",
        onPress: pickImage,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <CameraScreen onShutterPress={takeImage} cameraRef={cameraRef} />
      ) : (
        <>
          <Text>
            Fill out all the requirements below before reporting a violation
          </Text>
          <View
            style={{
              paddingHorizontal: 15,
            }}
          >
            <CustomButton
              title="Upload vehicle photo"
              onPress={() => {
                setType("vehicle");
                openAlert();
              }}
            />
            <CustomButton
              title="Upload license photo"
              onPress={() => {
                setType("license");
                openAlert();
              }}
            />
            {/* <CustomButton title="Make fetch call" onPress={fetchData} /> */}
            {licensePhoto && (
              <ImageView label="License photo" source={vehiclePhoto} />
            )}
            {vehiclePhoto && (
              <ImageView label="Vehicle photo" source={vehiclePhoto} />
            )}
            <InputField
              label="Enter the license plate"
              placeholder={"Enter the license plate"}
              value={licensePlate}
              inputType={"text"}
            />
            {violation === "Others" && (
              <InputField
                inputValue={violationDescription}
                placeholder={"Describe the parking violation"}
                label="Describe the parking violation"
              />
            )}
          </View>
          <View>
            <CustomDropdown
              options={violationOptions}
              onSelect={handleSelect}
            />
          </View>
          <CustomButton onPress={openAlert} title={"Report Violation"} />
          <StatusBar style="auto" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: "15%",
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
