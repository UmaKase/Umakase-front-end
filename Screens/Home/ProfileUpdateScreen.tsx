import {
  backgroundColor,
  drawerColor,
  errTextColor,
  lightTextColor,
  paddingLarge,
  textLarge,
  textMedium,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import {
  DrawerActions,
  StackActions,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../../Types/Home/Profile/ProfileStackProps";
import {
  profileUpdateMode,
  profileUpdateTitle,
  profileUpdScreenStr,
} from "../../Constants/ProfileConst";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { AuthAPI, UserAPI } from "../../Constants/backendAPI";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ACCESS_KEY, REFRESH_KEY } from "../../Constants/securestoreKey";
import * as SecureStore from "expo-secure-store";
import { FontAwesome } from "@expo/vector-icons";
import { commonStyle } from "../../Style/CommonStyle";

type ProfileUpdateScreenProps = NativeStackScreenProps<
  ProfileStackProps,
  "ProfileUpdateScreen"
>;
const ProfileUpdateScreen: React.FC<ProfileUpdateScreenProps> = ({
  navigation,
  route,
}) => {
  const [newLastName, setNewLastName] = useState<string>("");
  const [newSurName, setNewSurName] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [confirmValue, setConfirmValue] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>();
  const [errMsg, setErrMsg] = useState<string>("");
  const originalLastName: string = route.params.lastName
    ? route.params.lastName
    : "";
  const originalFirstName: string = route.params.firstName
    ? route.params.firstName
    : "";
  //predefined function/processes
  //request api to update personal info
  const updateProcess = async (
    userId: string,
    mode: number,
    successCallBack: (res: AxiosResponse) => void,
    failCallback: (res: Error | AxiosError) => void
  ) => {
    const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    let requestMethod = "";
    let requestUrl = "";
    let requestData = undefined;

    //refresh token error handler
    if (!localRefreshToken) {
      console.log("No local refresh token");
      return Alert.alert("Error", "No local refresh token");
    }
    console.log("lasyname" + newLastName);
    //update personal property
    if (mode == profileUpdateMode.personalInfo) {
      requestMethod = "put";
      requestUrl = `${UserAPI}/profile`;
      requestData = {
        firstname: newSurName,
        lastname: newLastName,
      };
    }
    //update password
    else if (mode === profileUpdateMode.password) {
      //incomplete
      return;
    }
    //call update property api
    customAxiosInstance({
      method: requestMethod,
      url: requestUrl,
      data: requestData,
    })
      .then((res) => {
        successCallBack(res);
      })
      .catch((e) => {
        console.log(e.response.data);
        failCallback(e);
      });
  };
  //request api to login
  const LoginProcess = async (
    username: string,
    password: string,
    successCallBack: (res: AxiosResponse) => void,
    failCallback: (res: Error | AxiosError) => void
  ) => {
    console.log(`username:${username};password:${password}`);
    axios({
      method: "post",
      url: `${AuthAPI}/login`,
      data: {
        username: username,
        password: password,
      },
    })
      .then(async (loginResult) => {
        console.log("success:" + loginResult);
        //ANCHOR saving basic info
        // prettier-ignore
        await SecureStore.setItemAsync(ACCESS_KEY, loginResult.data.data.accessToken);
        // prettier-ignore
        await SecureStore.setItemAsync(REFRESH_KEY, loginResult.data.data.refreshToken);
        successCallBack(loginResult);
      })
      .catch((e) => {
        console.log("fail:" + e);
        failCallback(e);
      });
  };
  //verify input function
  const verifyInput = (): boolean => {
    if (route.params.mode == profileUpdateMode.password) {
      if (confirmValue == "" || newValue == "") {
        setErrMsg(profileUpdScreenStr.errMsgNotNull);
        return false;
      } else if (confirmValue != newValue) {
        setErrMsg(profileUpdScreenStr.errMsgUnequip);
        return false;
      } else {
        setErrMsg(profileUpdScreenStr.errMsgEmpty);
        return true;
      }
    } else if (route.params.mode == profileUpdateMode.personalInfo) {
      if (newLastName == "" && newSurName == "") {
        setErrMsg(profileUpdScreenStr.errMsgNotNull);
        return false;
      } else {
        setErrMsg(profileUpdScreenStr.errMsgEmpty);
        return true;
      }
    }
    return true;
  };
  useEffect(() => {
    setNewLastName(originalLastName);
    setNewSurName(originalFirstName);
  }, []);
  let inputForm;
  //if update value is password, add text input for confirming the new password
  if (route.params.mode === profileUpdateMode.password) {
    inputForm = (
      <View>
        <View
          style={[
            commonStyle.rowContainer,
            styles.formRowContainer,
            { justifyContent: "flex-start", paddingTop: 0 },
          ]}
        >
          <Text style={commonStyle.subtitleText}>
            {profileUpdScreenStr.newPwdHint}
          </Text>
        </View>
        <View
          style={[commonStyle.rowContainer, { height: windowHeight * 0.06 }]}
        >
          <TextInput
            style={styles.textbox}
            value={newValue}
            onChangeText={setNewValue}
            secureTextEntry={true}
          ></TextInput>
        </View>
        <View
          style={[
            commonStyle.rowContainer,
            styles.formRowContainer,
            { justifyContent: "flex-start" },
          ]}
        >
          <Text style={commonStyle.subtitleText}>
            {profileUpdScreenStr.pwdConfirmHint}
          </Text>
        </View>
        <View
          style={[commonStyle.rowContainer, { height: windowHeight * 0.06 }]}
        >
          <TextInput
            style={styles.textbox}
            value={confirmValue}
            onChangeText={setConfirmValue}
            secureTextEntry={true}
          ></TextInput>
        </View>
        <View
          style={[
            commonStyle.rowContainer,
            styles.formRowContainer,
            { justifyContent: "flex-start" },
          ]}
        >
          <Text style={commonStyle.subtitleText}>
            {profileUpdScreenStr.oldPwdHint}
          </Text>
        </View>
        <View
          style={[commonStyle.rowContainer, { height: windowHeight * 0.06 }]}
        >
          <TextInput
            style={styles.textbox}
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={true}
          ></TextInput>
        </View>
      </View>
    );
  } else if (route.params.mode === profileUpdateMode.personalInfo) {
    inputForm = (
      <View>
        <View
          style={[
            commonStyle.rowContainer,
            styles.formRowContainer,
            { justifyContent: "flex-start", marginTop: 0 },
          ]}
        >
          <Text style={commonStyle.subtitleText}>
            {profileUpdScreenStr.lastnameHint}
          </Text>
        </View>
        <View
          style={[commonStyle.rowContainer, { height: windowHeight * 0.06 }]}
        >
          <TextInput
            style={styles.textbox}
            value={newLastName}
            onChangeText={setNewLastName}
          ></TextInput>
        </View>
        <View
          style={[
            commonStyle.rowContainer,
            styles.formRowContainer,
            { justifyContent: "flex-start" },
          ]}
        >
          <Text style={commonStyle.subtitleText}>
            {profileUpdScreenStr.surnameHint}
          </Text>
        </View>
        <View
          style={[commonStyle.rowContainer, { height: windowHeight * 0.06 }]}
        >
          <TextInput
            style={styles.textbox}
            value={newSurName}
            onChangeText={setNewSurName}
          ></TextInput>
        </View>
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={commonStyle.safeArea}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        ></CustomHeader>
        <View style={[commonStyle.mainContainer]}>
          <View style={commonStyle.rowContainer}>
            <Text style={[commonStyle.textContainer, commonStyle.titleText]}>
              {profileUpdateTitle[route.params.mode]}
            </Text>
          </View>
          <View style={commonStyle.rowContainer}>
            <Text style={[commonStyle.textContainer, commonStyle.errText]}>
              {errMsg}
            </Text>
          </View>
          {inputForm}
        </View>
        <View style={[commonStyle.footer]}>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              style={[styles.modeBtn]}
              onPress={() => {
                navigation.navigate("ProfileScreen");
              }}
            >
              <FontAwesome
                name="arrow-left"
                size={windowWidth * 0.09}
                color={lightTextColor}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              style={[styles.modeBtn]}
              onPress={() => {
                //input verify
                if (!verifyInput()) {
                  return;
                }
                const successCallback = () => {
                  //update info
                  updateProcess(
                    route.params.userId,
                    route.params.mode,
                    () => {
                      if (
                        route.params.mode === profileUpdateMode.personalInfo
                      ) {
                        console.log("updateProcess");
                        if (route.params.setLastName) {
                          console.log("setLastName");
                          route.params.setLastName(newLastName);
                        }
                        if (route.params.setFirstName) {
                          console.log(newSurName);
                          route.params.setFirstName(newSurName);
                        }
                      }

                      setErrMsg(profileUpdScreenStr.errMsgEmpty);
                      navigation.pop();
                    },
                    () => {
                      setErrMsg(profileUpdScreenStr.errMsgLogin);
                    }
                  );
                };
                const failCallback = () => {
                  setErrMsg(profileUpdScreenStr.errMsgLogin);
                  setOldPassword("");
                  return false;
                };
                //authentication
                if (route.params.mode == profileUpdateMode.password) {
                  LoginProcess(
                    route.params.userName,
                    oldPassword ? oldPassword : "",
                    successCallback,
                    failCallback
                  );
                } else {
                  successCallback();
                }
              }}
            >
              <FontAwesome
                name="check"
                size={windowWidth * 0.09}
                color={lightTextColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfileUpdateScreen;
const buttonSize = windowWidth * 0.17;

const styles = StyleSheet.create({
  sideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  formRowContainer: {
    paddingLeft: paddingLarge,
    marginTop: paddingLarge,
  },
  textbox: {
    justifyContent: "center",
    width: windowWidth,
    height: windowHeight * 0.06,
    flex: 0.9,
    fontSize: windowWidth * 0.06,
    color: lightTextColor,
    borderBottomWidth: 1,
    backgroundColor: drawerColor,
  },
  modeBtn: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    marginHorizontal: windowWidth * 0.02,
    borderWidth: 5,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
