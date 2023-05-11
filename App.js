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
  const takeImage = async () => {
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

  const [data, setData] = useState();

  const fetchData = () => {
    fetch(
      "https://dwp-nonprod.azure-api.net/smartparking/v1.0/vehicle/region/1/registration/admin?AS",
      {
        headers: {
          "SmartParking-Apim-Subscription-Key":
            "296b3ec4113047c0922a3b2f6a282a4e",
          Authorization: "",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
    console.log("HERE IS  THE RESULT");
  };

  // Set photos related code
  const [type, setType] = useState();
  const [licensePhoto, setLicensePhoto] = useState();
  const [vehiclePhoto, setVehiclePhoto] = useState();

  return (
    <View style={styles.container}>
      {/* Camera screen */}
      {isCameraOpen ? (
        <Camera
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <Button title="Take Pic" onPress={takeImage} />
          </View>
          <StatusBar style="auto" />
        </Camera>
      ) : (
        <>
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
            <Button
              title="Upload vehicle photo"
              onPress={() => {
                setType("vehicle");
                Alert.alert("Upload vehicle photo", "My Alert Msg", [
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
              }}
            />
            <Button
              title="Upload license photo"
              onPress={() => {
                setType("license");
                Alert.alert("Upload license photo", "My Alert Msg", [
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
              }}
            />
            <Button title="Make fetch call" onPress={fetchData} />
            {licensePhoto && (
              <>
                <Text>License photo</Text>
                <ImageBackground
                  source={{ uri: licensePhoto }}
                  style={{ width: 200, height: 200 }}
                />
              </>
            )}
            {vehiclePhoto && (
              <>
                <Text>Vehicle photo</Text>
                <ImageBackground
                  source={{ uri: vehiclePhoto }}
                  style={{ width: 200, height: 200 }}
                />
              </>
            )}
          </View>
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
});
