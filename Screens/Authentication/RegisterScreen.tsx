import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import {
  backgroundColor,
  cornerRadius,
  paddingLarge,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import {
  Fontisto,
  Feather,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI } from "../../Constants/backendAPI";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthNavigationProps } from "../../Types/Navigations/Auth";
import AuthInputWithErrMsg from "../../Components/Auth/AuthInputWithErrMsg";
import { registerError } from "../../Types/api";
import AuthInput from "../../Components/Auth/AuthInput";
import RegisterInput from "../../Components/Auth/RegisterInput";
import SubmitButton from "../../Components/Auth/SubmitButton";

type Props = NativeStackScreenProps<AuthNavigationProps, "RegisterScreen">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  //states for
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // error show
  const [emailErr, setEmailErr] = useState(false);
  const [usernameErr, setUsernameErr] = useState(false);
  const [firstNameErr, setFirstNameErr] = useState(false);
  const [lastNameErr, setLastNameErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [passwordCheckErr, setPasswordCheckErr] = useState(false);

  function register() {
    console.log("register");
    setEmailErr(!emailErr);
    setPasswordErr(!passwordErr);
    setPasswordCheckErr(!passwordCheckErr);
  }

  const iconSize = windowWidth * 0.07;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome
                name="angle-double-left"
                size={windowWidth * 0.1}
                color="#FFF"
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>新規会員登録</Text>
          </View>
          <View style={styles.inputContainer}>
            <RegisterInput
              InputIcon={
                <FontAwesome name="user" size={iconSize} color="#FFF" />
              }
              SetInputState={setEmail}
              PlaceHolder="メールアドレス"
              PasswordMode={false}
              errMsg="plz enter valid email"
              errorShow={emailErr}
            />
            <RegisterInput
              InputIcon={
                <FontAwesome name="user" size={iconSize} color="#FFF" />
              }
              SetInputState={setUsername}
              PlaceHolder="ユーザー名"
              PasswordMode={false}
              errMsg="plz enter valid email"
              errorShow={usernameErr}
            />
            <RegisterInput
              InputIcon={
                <FontAwesome name="user" size={iconSize} color="#FFF" />
              }
              SetInputState={setFirstName}
              PlaceHolder="姓"
              PasswordMode={false}
              errMsg="plz enter valid email"
              errorShow={firstNameErr}
            />
            <RegisterInput
              InputIcon={
                <FontAwesome name="user" size={iconSize} color="#FFF" />
              }
              SetInputState={setLastName}
              PlaceHolder="名"
              PasswordMode={false}
              errMsg="plz enter valid email"
              errorShow={lastNameErr}
            />
            <RegisterInput
              InputIcon={
                <FontAwesome5 name="unlock-alt" size={iconSize} color="#FFF" />
              }
              SetInputState={setPassword}
              PlaceHolder="パスワード"
              PasswordMode={true}
              errMsg="plz enter valid email"
              errorShow={passwordErr}
            />
            <RegisterInput
              InputIcon={
                <FontAwesome5 name="unlock-alt" size={iconSize} color="#FFF" />
              }
              SetInputState={setPasswordCheck}
              PlaceHolder="確認用パスワード"
              PasswordMode={true}
              errMsg="plz enter valid email"
              errorShow={passwordCheckErr}
            />
          </View>
        </KeyboardAvoidingView>
        <View style={styles.submitContainer}>
          <SubmitButton text="登録" onPressHandler={register} />
        </View>
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
    flex: 0.5,
    alignItems: "center",
  },
  headerText: {
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    marginLeft: windowWidth * 0.21,
  },
  submitContainer: {
    alignItems: "center",
    marginBottom: windowHeight * 0.05,
  },
});
