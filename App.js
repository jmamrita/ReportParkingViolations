import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Button,
  Image,
  View,
  Text,
  SafeAreaView,
  Alert,
  ImageBackground,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  // Dropdown related code
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: "Improper parking in 2 spots", value: "1" },
    { label: "Improper parking by blocking road ", value: "2" },
    { label: "Parking without a permit/registration", value: "3" },
    { label: "Parking in no-parking zone", value: "4" },
    { label: "Expired or missing license plates or registration", value: "5" },
    { label: "Parking in a reserved or restricted area", value: "6" },
    { label: "Parking in a special spot without proper permit", value: "7" },
    { label: "Other", value: "8" },
  ]);

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
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState();
  let cameraRef = useRef();
  const takeVehicleImage = async () => {
    setIsCameraOpen(true);
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setVehiclePhoto(newPhoto.uri);
    setIsCameraOpen(false);
  };
  const takeLicenseImage = async () => {
    setIsCameraOpen(true);
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setLicensePhoto(newPhoto.uri);
    setIsCameraOpen(false);
  };

  // Media library related code
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const pickVehicleImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setVehiclePhoto(result.assets[0].uri);
    }
  };
  const pickLicenseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setLicensePhoto(result.assets[0].uri);
    }
  };

  // Set photos related code
  const [licensePhoto, setLicensePhoto] = useState();
  const [vehiclePhoto, setVehiclePhoto] = useState();
  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera screen */}
      {isCameraOpen && (
        <Camera
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <Button title="Take Pic" onPress={takeVehicleImage} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Take Pic" onPress={takeLicenseImage} />
          </View>
          <StatusBar style="auto" />
        </Camera>
      )}
      {/* Landing Screen */}
      <View
        style={{
          paddingHorizontal: 15,
        }}
      >
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          maxHeight={400}
        />
        {value[0] === "8" && (
          <TextInput placeholder="Enter parking violation" />
        )}
        <Button title="Pick vehicle photo" onPress={pickVehicleImage} />
        <Button title="Pick license photo" onPress={pickLicenseImage} />
        <Button title="Take license photo" onPress={takeLicenseImage} />
        <Button title="Take vehicle photo" onPress={takeVehicleImage} />
        <Text>License photo</Text>
        {licensePhoto && (
          <ImageBackground
            source={{ uri: licensePhoto }}
            style={{ width: 200, height: 200 }}
          />
        )}
        <Text>Vehicle photo</Text>
        {vehiclePhoto && (
          <ImageBackground
            source={{ uri: vehiclePhoto }}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: "15%",
  },
});
