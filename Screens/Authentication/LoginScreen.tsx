import React, { useState } from "react";
//API
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { AuthAPI } from "../../Constants/backendAPI";
//components
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "../../Components/Auth/AuthInput";
//navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import { AuthNavigationProps } from "../../Types/Navigations/Auth";
//css const
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
//import vector icons
import { Feather, Fontisto } from "@expo/vector-icons/";
import {
  ACCESS_KEY,
  REFRESH_KEY,
  SHOWNAME_KEY,
  USERID_KEY,
  USERNAME_KEY,
} from "../../Constants/securestoreKey";

type Props = NativeStackScreenProps<AuthNavigationProps, "LoginScreen">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  //useState
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const LoginProcess = async () => {
    if (username == "" || password == "") {
      return Alert.alert("Error", "email or password input is missing!");
    }
    axios({
      method: "post",
      url: `${AuthAPI}/login`,
      data: {
        username: username,
        password: password,
      },
    })
      .then(async (loginResult) => {
        if (loginResult.data.ok === false) {
          return Alert.alert("Login failed", loginResult.data.error.message);
        }
        //ANCHOR saving basic info
        // prettier-ignore
        await SecureStore.setItemAsync(ACCESS_KEY, loginResult.data.accessToken);
        // prettier-ignore
        await SecureStore.setItemAsync(REFRESH_KEY, loginResult.data.refreshToken);

        // await SecureStore.setItemAsync(USERID_KEY, loginResult.data.profile.id);

        await SecureStore.setItemAsync(USERNAME_KEY, username);

        // await SecureStore.setItemAsync(SHOWNAME_KEY, loginResult.data.profile.showname);
        navigation.dispatch(
          CommonActions.reset({ routes: [{ name: "HomeStackNavigation" }] })
        );
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status == 400) {
          Alert.alert("Login failed", e.response.data.message);
        } else {
          console.log(e.response.data);
        }
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.topContainer}>
        <View style={styles.headerContainer}>
          {/* Icon of the application */}
          {/* <Entypo
            name="chat"
            size={windowWidth * 0.25}
            color={bg_LightColor}
            style={styles.iconContainer}
          /> */}
          <Text style={styles.headerTextContainer}>Umakase</Text>
        </View>
      </View>
      {/* Body */}
      <View style={styles.mainContainer}>
        <AuthInput
          InputIcon={
            <Feather name="user" size={windowWidth * 0.07} color="#FFF" />
          }
          SetInputState={setUsername}
          PlaceHolder="Enter username"
          PasswordMode={false}
        />
        <AuthInput
          InputIcon={
            <Fontisto name="locked" size={windowWidth * 0.07} color="#FFF" />
          }
          SetInputState={setPassword}
          PlaceHolder="Enter password"
          PasswordMode={true}
        />
      </View>
      {/* Footer */}
      <View style={styles.bottomContainer}>
        {/* Auth container */}
        <View style={styles.authBtnContainer}>
          <TouchableOpacity
            style={styles.authBtn}
            onPress={async () => await LoginProcess()}
          >
            <Text style={styles.btnText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authBtn}
            onPress={async () => navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.btnText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  //Header
  topContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: windowHeight * 0.05,
  },
  iconContainer: {},
  headerTextContainer: {
    color: "#FFF",
    fontFamily: "MajorMonoDisplay",
    fontSize: 54,
  },
  //Body
  mainContainer: {
    width: windowWidth,
    height: windowHeight * 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  //Footer
  bottomContainer: {
    width: windowWidth,
    height: windowHeight * 0.4,
  },
  //AuthBtn
  authBtnContainer: {
    width: windowWidth,
    height: windowHeight * 0.25,
    paddingTop: windowHeight * 0.02,
    alignItems: "center",
    // justifyContent: "center",
  },
  authBtn: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.07,
    marginTop: windowHeight * 0.03,
    borderWidth: 1.5,
    borderColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: windowWidth * 0.075,
    color: "#FFF",
  },
});

export default LoginScreen;
