import React, { useState } from "react";
//API
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { AuthAPI, ImgAPI } from "../../Constants/backendAPI";
//components
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
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
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons/";
import {
  ACCESS_KEY,
  REFRESH_KEY,
  SHOWNAME_KEY,
  USERID_KEY,
  USERNAME_KEY,
} from "../../Constants/securestoreKey";
import SubmitButton from "../../Components/Auth/SubmitButton";

type Props = NativeStackScreenProps<AuthNavigationProps, "LoginScreen">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  //useState
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const LoginProcess = async () => {
  //   if (username == "" || password == "") {
  //     return Alert.alert("Error", "email or password input is missing!");
  //   }
  //   axios({
  //     method: "post",
  //     url: `${AuthAPI}/login`,
  //     data: {
  //       username: username,
  //       password: password,
  //     },
  //   })
  //     .then(async (loginResult) => {
  //       //ANCHOR saving basic info
  //       // prettier-ignore
  //       await SecureStore.setItemAsync(ACCESS_KEY, loginResult.data.data.accessToken);
  //       // prettier-ignore
  //       await SecureStore.setItemAsync(REFRESH_KEY, loginResult.data.data.refreshToken);

  //       // await SecureStore.setItemAsync(USERID_KEY, loginResult.data.profile.id);

  //       // await SecureStore.setItemAsync(USERNAME_KEY, username);

  //       // await SecureStore.setItemAsync(SHOWNAME_KEY, loginResult.data.profile.showname);
  //       navigation.dispatch(
  //         CommonActions.reset({ routes: [{ name: "HomeStackNavigation" }] })
  //       );
  //     })
  //     .catch((e) => {
  //       if (e.response.status == 400) {
  //         Alert.alert("Login failed", e.response.data.message);
  //       } else {
  //         console.log("login catch else error:", e.response.data.message);
  //       }
  //     });
  // };

  const iconSize = windowWidth * 0.07;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../Image/Umakase.png")}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Umakase</Text>
      </View>
      <View style={styles.inputContainer}>
        <AuthInput
          SetInputState={setEmail}
          PlaceHolder="ユーザー名"
          InputIcon={<FontAwesome name="user" size={iconSize} color="#FFF" />}
          PasswordMode={false}
          style={{ marginTop: windowHeight * 0.056 }}
        />
        <AuthInput
          SetInputState={setPassword}
          PlaceHolder="パスワード"
          InputIcon={
            <FontAwesome5 name="unlock-alt" size={iconSize} color="#FFF" />
          }
          PasswordMode={true}
        />
        <SubmitButton
          onPressHandler={() => {
            console.log("login");
          }}
          text="ログイン"
          style={{
            marginTop: windowHeight * 0.03,
            marginBottom: windowHeight * 0.04,
          }}
        />
        <TouchableOpacity
          style={{ borderBottomColor: "#FFF", borderBottomWidth: 1 }}
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          <Text style={styles.registerText}>新規会員登録</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const logoSize = windowWidth * 0.3;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  logoContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 0.5,

    alignItems: "center",
  },
  logo: {
    width: logoSize,
    height: logoSize,
    resizeMode: "contain",
    marginTop: windowHeight * 0.1,
  },
  logoText: {
    fontSize: windowWidth * 0.1,
    fontWeight: "700",
    marginTop: windowHeight * 0.03,
  },
  registerText: {
    color: "#FFF",
    fontSize: windowWidth * 0.05,
  },
});

export default LoginScreen;
