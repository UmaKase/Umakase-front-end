import React, { useState } from "react";
import axios from "axios";
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { backgroundColor, cornerRadius, paddingLarge, windowHeight, windowWidth } from "../../Constants/cssConst";
import { Fontisto, Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI } from "../../Constants/backendAPI";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthNavigationProps } from "../../Types/Navigations/Auth";
import AuthInputWithErrMsg from "../../Components/Auth/AuthInputWithErrMsg";
import { registerError } from "../../Types/api";
import AuthInput from "../../Components/Auth/AuthInput";
import RegisterInput from "../../Components/Auth/RegisterInput";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { registerCheckCategory, registerCheckMessage, registerResultTitle } from "../../Constants/homeConst";
import { errorPopUp, infoPopUp } from "../../Components/Universal/AlertControl";

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
      errorPopUp("E0107");
      return;
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
          infoPopUp("I0102", undefined, [{ text: "OK", onPress: () => navigation.pop() }]);
          return;
        })
        .catch((e) => {
          setEmailErr(false);
          setUsernameErr(false);
          setPasswordErr(false);
          setPasswordCheckErr(false);
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
          errorPopUp("E0108", [errorMsg]);
          return;
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
              errMsg={registerCheckMessage[registerCheckCategory.emailInput]}
              errorShow={emailErr}
            />
            <RegisterInput
              InputIcon={<FontAwesome name="user" size={iconSize} color="#FFF" />}
              SetInputState={setUsername}
              PlaceHolder="ユーザー名"
              PasswordMode={false}
              errMsg={registerCheckMessage[registerCheckCategory.usernameInput]}
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
              errMsg={registerCheckMessage[registerCheckCategory.passwordInput]}
              errorShow={passwordErr}
            />
            <RegisterInput
              InputIcon={<FontAwesome5 name="unlock-alt" size={iconSize} color="#FFF" />}
              SetInputState={setPasswordCheck}
              PlaceHolder="確認用パスワード"
              PasswordMode={true}
              errMsg={registerCheckMessage[registerCheckCategory.confirmPasswordInput]}
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
