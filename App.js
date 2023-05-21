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
import * as AuthSession from "expo-auth-session";
import * as FileSystem from "expo-file-system";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [licensePlate, setLicensePlate] = useState("");
  const [violationDescription, setViolationDescription] = useState("");
  const [violation, setViolation] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isCameraOpen, setIsCameraOpen] = useState();
  const [licensePhoto, setLicensePhoto] = useState();
  const [vehiclePhoto, setVehiclePhoto] = useState();
  const typeRef = useRef();
  let cameraRef = useRef();
  let vehicleBase64 = useRef(null);
  let licenseBase64 = useRef(null);
  let shouldClear = useRef();

  const tenantID = "72f988bf-86f1-41af-91ab-2d7cd011db47";
  const clientID = "b56ecdc1-5106-47f3-8777-ad784d1118f6";

  const [discovery, $discovery] = useState();
  const [authRequest, $authRequest] = useState();
  const [authorizeResult, $authorizeResult] = useState();
  const scopes = ["openid", "profile", "email", "offline_access"];
  const domain = `https://login.microsoftonline.com/${tenantID}/v2.0`;
  const redirectUrl = AuthSession.makeRedirectUri(
    __DEV__ ? { scheme: "reportparkingviolation" } : {}
  );

  useEffect(() => {
    const getSession = async () => {
      const d = await AuthSession.fetchDiscoveryAsync(domain);
      const authRequestOptions = {
        prompt: AuthSession.Prompt.Login,
        responseType: AuthSession.ResponseType.Code,
        scopes: scopes,
        usePKCE: true,
        clientId: clientID,
        redirectUri: __DEV__ ? redirectUrl : redirectUrl + "example",
      };
      const authRequest = new AuthSession.AuthRequest(authRequestOptions);
      $authRequest(authRequest);
      $discovery(d);
    };
    getSession();
  }, []);

  useEffect(() => {
    const getCodeExchange = async () => {
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          code: authorizeResult.params.code,
          clientId: clientID,
          redirectUri: __DEV__ ? redirectUrl : redirectUrl + "example",
          extraParams: {
            code_verifier: authRequest.codeVerifier || "",
          },
        },
        discovery
      );
      const { accessToken, refreshToken, issuedAt, expiresIn } = tokenResult;
      console.log(accessToken, refreshToken, issuedAt, expiresIn);
      const response = await fetch(
        `https://graph.microsoft.com/oidc/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const responseJson = await response.json();
      const { family_name, given_name, email } = responseJson;
      console.log(family_name, given_name, email);
      return navigation.navigate("YOUR_NEXT_SCREEN");
    };
    if (authorizeResult && authorizeResult.type == "error") {
      //Handle error
    }
    if (
      authorizeResult &&
      authorizeResult.type == "success" &&
      authRequest &&
      authRequest.codeVerifier
    ) {
      getCodeExchange();
    }
  }, [authorizeResult, authRequest]);

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

  useEffect(() => {
    (async () => {
      if (vehiclePhoto) {
        vehicleBase64.current = await FileSystem.readAsStringAsync(
          vehiclePhoto,
          {
            encoding: "base64",
          }
        );
      }
    })();
  }, [vehiclePhoto]);

  useEffect(() => {
    (async () => {
      if (licensePhoto) {
        licenseBase64.current = await FileSystem.readAsStringAsync(
          licensePhoto,
          {
            encoding: "base64",
          }
        );
      }
    })();
  }, [licensePhoto]);

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

  const [data, setData] = useState();

  useEffect(() => {
    let url = `https://dwp-nonprod.azure-api.net/smartparking/v1.0/vehicle/region/4/registration/admin?licensePlate=${licensePlate}`;
    fetch(url, {
      headers: {
        "SmartParking-Apim-Subscription-Key":
          "296b3ec4113047c0922a3b2f6a282a4e",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL21pY3Jvc29mdC5vbm1pY3Jvc29mdC5jb20vc21hcnRQYXJraW5nQVBJTm9uUHJvZCIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE2ODQ2OTQyNTQsIm5iZiI6MTY4NDY5NDI1NCwiZXhwIjoxNjg0Njk5NDQ2LCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOFRBQUFBSGpJREhnVHF1YmZURHFpUlkrelFnU3h3WDA0RnBSaEZ0ZkFkMGNYMEZIQldscHZlRmFST3NtT2dlNHZqKzdRR0x0UTRWdlMxMFV1YUQxSzlPaTBUUE42STdJNm5Fam83Q25UWmdpazhuYUk9IiwiYW1yIjpbInB3ZCIsInJzYSIsIm1mYSJdLCJhcHBpZCI6IjI1MjIyMzhmLTcwMmMtNDYzNC04YmM4LTQ0YTJkNTdhN2M2NSIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiYmY3OTU5NGItZWYxMS00YjFhLTgxM2EtZTFmYTlkM2I5N2ViIiwiZmFtaWx5X25hbWUiOiJNdWtoZXJqZWUiLCJnaXZlbl9uYW1lIjoiQW1yaXRhIiwiaXBhZGRyIjoiMjQwNjpiNDAwOmI0OjczYzE6ZThhZDo3ZGVjOmUwY2I6YmFmMSIsIm5hbWUiOiJBbXJpdGEgTXVraGVyamVlIiwib2lkIjoiNmEwNjYzYjMtYzdmNS00MDE4LTlhNWMtOWYwOTMxODA3MjIzIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxNDY3NzMwODUtOTAzMzYzMjg1LTcxOTM0NDcwNy0yNzI0OTQyIiwicmgiOiIwLkFSb0F2NGo1Y3ZHR3IwR1JxeTE4MEJIYlJ3RWxpSWlHQWlGRmt5cDZhMk5iZUhrYUFIOC4iLCJyb2xlcyI6WyJQYXJraW5nLkFkbWluIl0sInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6Ikd3cTItcXdaUWdFd1lFckRoOWJaWWxkOVhKN2h1OFVENDlFUW5uTy1EQWciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6ImFtbXVraGVyamVlQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJhbW11a2hlcmplZUBtaWNyb3NvZnQuY29tIiwidXRpIjoibDFJTFFvVVA5RTZpNVo5d2o5Y3FBQSIsInZlciI6IjEuMCJ9.nv59RIK1rztpVmTbEmVmKTBn5L0Swb5iyNDdEnnKsIk0NhZbuBv__pZFgulES7E4OvfaVDOoSpPFXY3ypII7oLv4YtFsjGTe8-nWUbFYl4-Etw5CzC5yvlF53JrN9b8lCFkDySxwXG8lgErNQ2z1bQpLHPZGUdqQ3THXIf6OlvqlHeraO8gfCSdefDYONLpoHZKKRTLQ6sV00BMQbk1rD3Ln7Gv0EJjDYR-I5q6rYYTsJaCL3xYk7dEMgIknDp9xMVVHYLlaKsooql9PhSlc1gZ6w-feO2mSL1HTbbWehI_L3ryFdFKpjueuwBOdh0kuqWWKv5pASQdEQTXly0duEA",
      },
    })
      .then((response) => response.json())
      .then((json) => setData(json));
  }, [licensePlate]);

  const sendEmail = () => {
    fetch(
      `https://prod-88.westus.logic.azure.com:443/workflows/9645ddc648414d71ae4a9088af39a54d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SWHyMvq3DE6t6Oq1GIASgE1U7r9gP96j89Ljk_JBBTA`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          to: `${data?.user?.userAlias}@microsoft.com`,
          subject: `Parking violation for license plate: ${licensePlate.toUpperCase()}`,
          name: `${data?.user?.firstName} ${data?.user?.lastName}`,
          violation: violation === "Others" ? violationDescription : violation,
          vehiclePhotoBase64: vehicleBase64.current,
          licensePhotoBase64: licenseBase64.current,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => setData(json));
  };

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
              title="Login"
              onPress={async () => {
                const authorizeResult = await authRequest.promptAsync(
                  discovery
                );
                $authorizeResult(authorizeResult);
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
              clear={shouldClear.current}
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
              onPress={() => {
                sendEmail();
                Alert.alert(
                  "Email has been sent successfully",
                  "Return to application",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        setLicensePhoto(undefined),
                          setVehiclePhoto(undefined),
                          setLicensePlate(undefined),
                          (shouldClear.current = true),
                          setViolationDescription(undefined);
                      },
                    },
                  ]
                );
              }}
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
