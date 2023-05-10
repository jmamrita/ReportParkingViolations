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
    { label: "Other", value: "6" },
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
  const cameraRef = useRef(null);
  const takeVehicleImage = async () => {
    setIsCameraOpen(true);
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setVehiclePhoto(newPhoto);
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
    setLicensePhoto(newPhoto);
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
          <StatusBar style="auto" />
        </Camera>
      )}
      {/* Landing Screen */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
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
          multiple={true}
          mode="BADGE"
        />
        <Button title="Pick vehicle photo" onPress={pickVehicleImage} />
        <Button title="Pick license photo" onPress={pickLicenseImage} />
        <Button title="Take license photo" onPress={takeLicenseImage} />
        <Button title="Take vehicle photo" onPress={takeVehicleImage} />
        {licensePhoto && (
          <ImageBackground
            source={{ uri: licensePhoto && licensePhoto.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}
        {vehiclePhoto && (
          <Image
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
    alignItems: "center",
    justifyContent: "center",
  },
});
