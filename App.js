import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
  Button,
} from "react-native";
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
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [licensePlate, setLicensePlate] = useState("");
  const [violationDescription, setViolationDescription] = useState("");
  const [violation, setViolation] = useState();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isCameraOpen, setIsCameraOpen] = useState();
  const [licensePhoto, setLicensePhoto] = useState();
  const [vehiclePhoto, setVehiclePhoto] = useState();
  const typeRef = useRef();
  let cameraRef = useRef();

  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/v2.0"
  );
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "b56ecdc1-5106-47f3-8777-ad784d1118f6",
      scopes: ["openid", "profile", "email", "offline_access"],
      redirectUri: makeRedirectUri({
        scheme: "reportparkingviolation",
      }),
    },
    discovery
  );

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
    typeRef.current === "vehicle"
      ? setVehiclePhoto(newPhoto.uri)
      : setLicensePhoto(newPhoto.uri);
    setIsCameraOpen(false);
  };

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
      typeRef.current === "vehicle"
        ? setVehiclePhoto(result.assets[0].uri)
        : setLicensePhoto(result.assets[0].uri);
    }
  };
  const handleSelect = (option) => {
    setViolation(option);
  };
  const handleLicensePlateChange = (value) => {
    setLicensePlate(value);
  };
  const handleViolationChange = (value) => {
    setViolationDescription(value);
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

  const openAlert = () => {
    Alert.alert(
      `Add a ${typeRef.current} photo`,
      "Choose from the options below",
      [
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
      ]
    );
  };

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <CameraScreen onShutterPress={takeImage} cameraRef={cameraRef} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingHorizontal: 15,
            }}
          >
            <Button
              disabled={!request}
              title="Login"
              onPress={() => {
                promptAsync();
              }}
            />
            <Text
              style={{
                fontSize: 24,
                margin: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Report a parking violation
            </Text>
            <View style={{ borderWidth: 0.25 }} />
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <CustomButton
                iconName={vehiclePhoto ? "autorenew" : "add-a-photo"}
                title={"Vehicle"}
                onPress={() => {
                  typeRef.current = "vehicle";
                  openAlert();
                }}
                containerStyle={{
                  width: "30%",
                  margin: 10,
                }}
              />
              {vehiclePhoto && (
                <CustomButton
                  iconName={"delete"}
                  containerStyle={{
                    margin: 10,
                    alignSelf: "center",
                  }}
                  buttonColor="red"
                  title={"Remove"}
                  onPress={() => setVehiclePhoto(undefined)}
                />
              )}
            </View>
            {vehiclePhoto && (
              <ImageView label="Vehicle photo" source={vehiclePhoto} />
            )}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <CustomButton
                iconName={licensePhoto ? "autorenew" : "add-a-photo"}
                title="License plate"
                onPress={() => {
                  typeRef.current = "license";
                  openAlert();
                }}
                containerStyle={{
                  width: "40%",
                  margin: 10,
                  alignSelf: "center",
                }}
              />
              {licensePhoto && (
                <CustomButton
                  iconName={"delete"}
                  containerStyle={{
                    margin: 10,
                    alignSelf: "center",
                  }}
                  buttonColor="red"
                  title={"Remove"}
                  onPress={() => setLicensePhoto(undefined)}
                />
              )}
            </View>
            {/* <CustomButton title="Make fetch call" onPress={fetchData} /> */}
            {licensePhoto && (
              <ImageView label="License photo" source={licensePhoto} />
            )}
            <InputField
              label="Enter the license plate"
              placeholder={"Enter the license plate"}
              inputValue={licensePlate}
              onChange={handleLicensePlateChange}
              multiline={false}
            />
            <CustomDropdown
              options={violationOptions}
              onSelect={handleSelect}
            />
            {violation === "Others" && (
              <InputField
                inputValue={violationDescription}
                placeholder={"Describe the parking violation"}
                label="Describe the parking violation"
                onChange={handleViolationChange}
                multiline={true}
              />
            )}
            <CustomButton
              onPress={() =>
                Alert.alert("Email has been successfully sent to user")
              }
              title={"Send report"}
              disabled={
                !vehiclePhoto ||
                !licensePhoto ||
                !licensePlate ||
                !violation ||
                (violation === "Others" && !violationDescription)
              }
              containerStyle={{ alignSelf: "center", marginTop: 20 }}
            />
          </View>
          <StatusBar style="auto" />
        </ScrollView>
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
