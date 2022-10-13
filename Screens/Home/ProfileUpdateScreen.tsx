import {
  backgroundColor,
  drawerColor,
  errTextColor,
  lightTextColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import { DrawerActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../../Types/Home/Profile/ProfileStackProps";
import {
  profileUpdateMode,
  profileUpdateValueName,
} from "../../Constants/ProfileConst";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { UserAPI } from "../../Constants/backendAPI";
import { REFRESH_KEY } from "../../Constants/securestoreKey";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError, AxiosResponse } from "axios";

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
        setErrMsg("");
        return true;
      } else {
        setErrMsg("入力パスワードは一致しない。");
        return false;
      }
    }
    return true;
  };
  let onLoadBool = true;
  useEffect(() => {
    console.log(route.params.userId);
    const focus = navigation.addListener("focus", () => {
      if (!onLoadBool) {
        navigation.goBack();
      } else {
        onLoadBool = false;
      }
    });
  }, []);
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
          <Text style={styles.subtitleText}>パスワード確認</Text>
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
            <Text style={[styles.textContainer, styles.errText]}>{errMsg}</Text>
          </View>
          <View
            style={[
              styles.rowContainer,
              styles.formRowContainer,
              { justifyContent: "flex-start" },
            ]}
          >
            <Text style={styles.subtitleText}>新しい{updateValueName}</Text>
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
            <Text style={styles.subtitleText}>古いパスワード</Text>
          </View>
          <View style={[styles.rowContainer, { height: windowHeight * 0.06 }]}>
            <TextInput
              style={styles.textbox}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={true}
            ></TextInput>
          </View>
          <View style={[styles.rowContainer, styles.formRowContainer]}>
            <TouchableOpacity
              style={styles.button_active}
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
              <Text style={styles.button_text}>設定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfileUpdateScreen;
const subtitleFontSize = windowWidth * 0.05;
const bigFontSize = windowWidth * 0.07;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  logoutBtn: {
    backgroundColor: "#888",
  },
  mainContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "flex-start",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
  },
  formRowContainer: {
    marginTop: 15,
  },
  textContainer: {
    flex: 1,
    textAlign: "center",
    color: lightTextColor,
  },
  titleText: {
    fontSize: bigFontSize,
  },
  subtitleText: {
    fontSize: subtitleFontSize,
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
  button_active: {
    alignItems: "center",
    backgroundColor: drawerColor,
    width: windowWidth * 0.8,
    paddingTop: 5,
    paddingBottom: 5,
  },
  button_disable: {
    alignItems: "center",
    backgroundColor: "#b8b8b8",
    width: windowWidth * 0.8,
    paddingTop: 5,
    paddingBottom: 5,
  },
  button_text: {
    color: lightTextColor,
  },
});
