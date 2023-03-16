import React, { useState } from "react";
import axios from "axios";
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { backgroundColor, cornerRadius, paddingLarge, windowHeight, windowWidth } from "../../Constants/cssConst";
import { Fontisto, Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI, UserAPI } from "../../Constants/backendAPI";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthNavigationProps } from "../../Types/Navigations/Auth";
import AuthInputWithErrMsg from "../../Components/Auth/AuthInputWithErrMsg";
import { registerError } from "../../Types/api";
import AuthInput from "../../Components/Auth/AuthInput";
import RegisterInput from "../../Components/Auth/RegisterInput";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { registerErrorCategory, registerErrorMessage, registerResultTitle } from "../../Constants/homeConst";
import { ACCESS_KEY, REFRESH_KEY, TEMPUSERID_KEY, TEMPUSERPASS_KEY } from "../../Constants/securestoreKey";
import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { merge } from "lodash";

type Props = NativeStackScreenProps<AuthNavigationProps, "RegisterScreen">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  //value of input field
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  //flag for input error msg
  const [emailErr, setEmailErr] = useState(false);
  const [usernameErr, setUsernameErr] = useState(false);
  const [firstNameErr, setFirstNameErr] = useState(false);
  const [lastNameErr, setLastNameErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [passwordCheckErr, setPasswordCheckErr] = useState(false);

  const resetErrMsg = () => {
    setEmailErr(false);
    setUsernameErr(false);
    setFirstNameErr(false);
    setLastNameErr(false);
    setPasswordErr(false);
    setPasswordCheckErr(false);
  };
  const MergeProcess = async () => {
    const tmpUser = await SecureStore.getItemAsync(TEMPUSERID_KEY);
    const tmpPassword = await SecureStore.getItemAsync(TEMPUSERPASS_KEY);

    await customAxiosInstance({
      method: "post",
      url: `${UserAPI}/tmp/merge`,
      data: {
        tmpId: tmpUser,
        tmpPass: tmpPassword,
      },
    })
      .then(async (mergeResult) => {
        console.log(mergeResult);
        Alert.alert("Success", "Merge user success");
        navigation.goBack();
      })
      .catch((e) => {
        console.log(e.response.data);
        console.log("merge user Error:", e.response.data.message);
        return Alert.alert("Error", "cannot merge user");
      });
  };
  const LoginProcess = async () => {
    axios({
      method: "post",
      url: `${AuthAPI}/login`,
      data: {
        username: username,
        password: password,
      },
    })
      .then(async (loginResult) => {
        console.log("login success");
        console.log(loginResult);
        //ANCHOR saving basic info
        // prettier-ignore
        await SecureStore.setItemAsync(ACCESS_KEY, loginResult.data.data.accessToken);
        // prettier-ignore
        await SecureStore.setItemAsync(REFRESH_KEY, loginResult.data.data.refreshToken);

        MergeProcess();
      })
      .catch((e) => {
        if (e.response.status == 400) {
          Alert.alert("Login failed", e.response.data.message);
        } else {
          console.log("login catch else error:", e.response.data.message);
        }
      });
  };
  const RegisterProcess = async () => {
    //input empty check
    resetErrMsg();
    let preCheck = true;
    if (email == undefined || email == "") {
      setEmailErr(true);
      preCheck = false;
    }
    if (username == undefined || username == "") {
      setUsernameErr(true);
      preCheck = false;
    }
    if (password == undefined || password == "") {
      setPasswordErr(true);
      preCheck = false;
    }
    if (passwordCheck == undefined || passwordCheck == "") {
      setPasswordCheckErr(true);
      preCheck = false;
    }
    if (password != passwordCheck) {
      preCheck = false;
      return Alert.alert(registerResultTitle.failure, registerErrorMessage[registerErrorCategory.passwordUnmatch]);
    }
    if (preCheck) {
      axios({
        method: "post",
        url: `${AuthAPI}/register`,
        data: {
          email: email,
          username: username,
          password: password,
          firstname: firstName,
          lastname: lastName,
        },
      })
        .then((result) => {
          return Alert.alert("Register", "Register success!", [{ text: "OK", onPress: () => LoginProcess() }]);
        })
        .catch((e) => {
          setEmailErr(false);
          setUsernameErr(false);
          setPasswordErr(false);
          setPasswordCheckErr(false);
          console.log("Register error");
          console.log(e);
          const errors = e.response.data.data.error as registerError[];
          let errorMsg = "";
          errors.forEach((error) => {
            console.log(`$error:${error.msg}, param:${error.param}`);
            if (errorMsg === "") {
              errorMsg = `${errorMsg}${error.param}:${error.msg}`;
            } else {
              errorMsg = `${errorMsg}\n${error.param}:${error.msg}`;
            }
          });
          return Alert.alert(registerResultTitle.failure, errorMsg);
        });
    }
  };
  function register() {
    RegisterProcess();
  }

  const iconSize = windowWidth * 0.07;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="angle-double-left" size={windowWidth * 0.1} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerText}>新規会員登録</Text>
          </View>
          <View style={styles.inputContainer}>
            <RegisterInput
              InputIcon={<FontAwesome name="user" size={iconSize} color="#FFF" />}
              SetInputState={setEmail}
              PlaceHolder="メールアドレス"
              PasswordMode={false}
              errMsg={registerErrorMessage[registerErrorCategory.emailInput]}
              errorShow={emailErr}
            />
            <RegisterInput
              InputIcon={<FontAwesome name="user" size={iconSize} color="#FFF" />}
              SetInputState={setUsername}
              PlaceHolder="ユーザー名"
              PasswordMode={false}
              errMsg={registerErrorMessage[registerErrorCategory.usernameInput]}
              errorShow={usernameErr}
            />
            <RegisterInput
              InputIcon={<FontAwesome name="user" size={iconSize} color="#FFF" />}
              SetInputState={setFirstName}
              PlaceHolder="姓"
              PasswordMode={false}
              errMsg="plz enter valid email"
              errorShow={firstNameErr}
            />
            <RegisterInput
              InputIcon={<FontAwesome name="user" size={iconSize} color="#FFF" />}
              SetInputState={setLastName}
              PlaceHolder="名"
              PasswordMode={false}
              errMsg="plz enter valid email"
              errorShow={lastNameErr}
            />
            <RegisterInput
              InputIcon={<FontAwesome5 name="unlock-alt" size={iconSize} color="#FFF" />}
              SetInputState={setPassword}
              PlaceHolder="パスワード"
              PasswordMode={true}
              errMsg={registerErrorMessage[registerErrorCategory.passwordInput]}
              errorShow={passwordErr}
            />
            <RegisterInput
              InputIcon={<FontAwesome5 name="unlock-alt" size={iconSize} color="#FFF" />}
              SetInputState={setPasswordCheck}
              PlaceHolder="確認用パスワード"
              PasswordMode={true}
              errMsg={registerErrorMessage[registerErrorCategory.confirmPasswordInput]}
              errorShow={passwordCheckErr}
            />
          </View>
          <View style={styles.submitContainer}>
            <SubmitButton text="登録" onPressHandler={register} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  header: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: paddingLarge,
  },
  inputContainer: {
    flex: 0.8,
    alignItems: "center",
  },
  headerText: {
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    marginLeft: windowWidth * 0.21,
  },
  submitContainer: {
    flex: 0.1,
    alignItems: "center",
  },
});
