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
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../../Types/Home/Profile/ProfileStackProps";
import {
  profileUpdateMode,
  profileUpdateValueName,
  profileUpdScreenStr,
} from "../../Constants/profileConst";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { UserAPI } from "../../Constants/backendAPI";
import { REFRESH_KEY } from "../../Constants/securestoreKey";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError, AxiosResponse } from "axios";
import { FontAwesome } from "@expo/vector-icons";

type ProfileUpdateScreenProps = NativeStackScreenProps<
  ProfileStackProps,
  "ProfileUpdateScreen"
>;
let updateValueName = "";
const ProfileUpdateScreen: React.FC<ProfileUpdateScreenProps> = ({
  navigation,
  route,
}) => {
  const [newValue, setNewValue] = useState<string>();
  const [confirmValue, setConfirmValue] = useState<string>();
  const [oldPassword, setOldPassword] = useState<string>();
  const [errMsg, setErrMsg] = useState<string>("");
  //predefined function/processes
  //request api to update personal info
  const updateProcess = async (
    userId: string,
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
    console.log("userid:" + route.params.userId);
    //update email property
    if (route.params.mode === profileUpdateMode.email) {
      requestMethod = "put";
      requestUrl = `${UserAPI}/profile/email`;
      requestData = {
        email: newValue,
      };
    } else {
      return;
    }
    console.log(requestData);
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
  //verify input function
  const verifyInput = (): boolean => {
    if (route.params.mode == profileUpdateMode.password) {
      if (confirmValue == newValue) {
        setErrMsg(profileUpdScreenStr.errMsgEmpty);
        return true;
      } else {
        setErrMsg(profileUpdScreenStr.errMsgUnequip);
        return false;
      }
    }
    return true;
  };
  let firstLoadBool = true;

  useFocusEffect(
    React.useCallback(() => {
      return () => navigation.goBack();
    }, [])
  );
  //get name of update value
  updateValueName = profileUpdateValueName[route.params.mode];
  let confirmInput;
  //if update value is password, add text input for confirming the new password
  if (route.params.mode === profileUpdateMode.password) {
    confirmInput = (
      <View>
        <View
          style={[
            styles.rowContainer,
            styles.formRowContainer,
            { justifyContent: "flex-start" },
          ]}
        >
          <Text style={styles.subtitleText}>
            {profileUpdScreenStr.pwdConfirmHint}
          </Text>
        </View>
        <View style={[styles.rowContainer, { height: windowHeight * 0.06 }]}>
          <TextInput
            style={styles.textbox}
            value={confirmValue}
            onChangeText={setConfirmValue}
            secureTextEntry={true}
          ></TextInput>
        </View>
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        ></CustomHeader>
        <View style={styles.mainContainer}>
          <View style={styles.rowContainer}>
            <Text style={[styles.textContainer, styles.titleText]}>
              {updateValueName}
              {profileUpdScreenStr.titlePostfix}
            </Text>
            <Text style={[styles.textContainer, styles.errText]}>{errMsg}</Text>
          </View>
          <View
            style={[
              styles.rowContainer,
              styles.formRowContainer,
              { justifyContent: "flex-start" },
            ]}
          >
            <Text style={styles.subtitleText}>
              {profileUpdScreenStr.newValHint}
              {updateValueName}
            </Text>
          </View>
          <View style={[styles.rowContainer, { height: windowHeight * 0.06 }]}>
            <TextInput
              style={styles.textbox}
              value={newValue}
              onChangeText={setNewValue}
              secureTextEntry={
                route.params.mode === profileUpdateMode.password ? true : false
              }
            ></TextInput>
          </View>
          {confirmInput}
          <View
            style={[
              styles.rowContainer,
              styles.formRowContainer,
              { justifyContent: "flex-start" },
            ]}
          >
            <Text style={styles.subtitleText}>
              {profileUpdScreenStr.oldPwdHint}
            </Text>
          </View>
          <View style={[styles.rowContainer, { height: windowHeight * 0.06 }]}>
            <TextInput
              style={styles.textbox}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={true}
            ></TextInput>
          </View>
        </View>
        <View style={[styles.footer]}>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              style={[styles.modeBtn]}
              onPress={() => {
                navigation.goBack();
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
                if (!verifyInput()) {
                  console.log("Incorrect password");
                  return;
                }
                console.info(verifyInput());
                updateProcess(
                  route.params.userId,
                  () => {
                    navigation.goBack();
                  },
                  () => {}
                );
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
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  logoutBtn: {
    backgroundColor: "#888",
  },
  mainContainer: {
    flex: 1,
    paddingTop: paddingLarge,
    paddingBottom: paddingLarge,
    justifyContent: "flex-start",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: windowHeight * 0.01,
  },
  footer: {
    height: windowHeight * 0.08,
    width: windowWidth,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: windowHeight * 0.04,
  },
  sideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  formRowContainer: {
    marginTop: paddingLarge,
  },
  textContainer: {
    textAlign: "center",
    color: lightTextColor,
  },
  titleText: {
    fontSize: textLarge,
  },
  subtitleText: {
    fontSize: textMedium,
    textAlign: "left",
    color: lightTextColor,
  },
  errText: {
    color: errTextColor,
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
  button_text: {
    color: lightTextColor,
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
