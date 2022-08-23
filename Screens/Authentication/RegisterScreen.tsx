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
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { Fontisto, Feather, FontAwesome } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI } from "../../Constants/backendAPI";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthNavigationProps } from "../../types/Navigations/Auth";
import AuthInputWithErrMsg from "../../Components/Auth/AuthInputWithErrMsg";
import { registerError } from "../../types/api";

type Props = NativeStackScreenProps<AuthNavigationProps, "RegisterScreen">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  //useState
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailErrMsgShow, setEmailErrMsgShow] = useState(false);
  const [usernameErrMsgShow, setUsernameErrMsgShow] = useState(false);
  const [passwordErrMsgShow, setPasswordErrMsgShow] = useState(false);

  const RegisterProcess = async () => {
    if (
      email == "" ||
      username == "" ||
      password == "" ||
      passwordCheck == ""
    ) {
      return Alert.alert("Error", "Missing input value!");
    } else if (password != passwordCheck) {
      return Alert.alert(
        "Password check failed",
        "The password input is not the same, please check it again!"
      );
    }
    axios({
      method: "post",
      url: `${AuthAPI}/register`,
      data: {
        email: email,
        username: username,
        password: password,
        firstname: "",
        lastname: "",
      },
    })
      .then((result) => {
        return Alert.alert("Register", "Register success!", [
          { text: "OK", onPress: () => navigation.pop() },
        ]);
      })
      .catch((e) => {
        setEmailErrMsgShow(false);
        setUsernameErrMsgShow(false);
        setPasswordErrMsgShow(false);
        console.log(JSON.stringify(e.response.data));
        const errors = e.response.data.data.error as registerError[];
        let errorMsg = "";
        errors.forEach((error) => {
          if (errorMsg === "") {
            errorMsg = `${errorMsg}${error.param}:${error.msg}`;
          } else {
            errorMsg = `${errorMsg}\n${error.param}:${error.msg}`;
          }
          if (error.param == "email") {
            setEmailErrMsgShow(true);
          }
          if (error.param == "username") {
            setUsernameErrMsgShow(true);
          }
          if (error.param == "password") {
            setPasswordErrMsgShow(true);
          }
        });
        return Alert.alert("Register error", errorMsg);
      });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior="position">
          {/* Header */}
          <View style={styles.topContainer}>
            <TouchableOpacity
              style={styles.goback}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome
                name="angle-double-left"
                size={windowWidth * 0.12}
                color="#FFF"
              />
            </TouchableOpacity>
            <Text style={styles.headerTextContainer}>Register</Text>
          </View>
          {/* Body */}
          <View style={styles.mainContainer}>
            <AuthInputWithErrMsg
              InputIcon={
                <Fontisto name="email" size={windowWidth * 0.07} color="#FFF" />
              }
              SetInputState={setEmail}
              PlaceHolder="Enter email"
              PasswordMode={false}
            />
            {emailErrMsgShow ? (
              <View style={styles.errMsgContainer}>
                <Text style={styles.errMsg}>
                  Email should be 12345@123.12 format
                </Text>
              </View>
            ) : (
              <></>
            )}
            <AuthInputWithErrMsg
              InputIcon={
                <Feather name="user" size={windowWidth * 0.07} color="#FFF" />
              }
              SetInputState={setUsername}
              PlaceHolder="Enter user name"
              PasswordMode={false}
            />
            {usernameErrMsgShow ? (
              <View style={styles.errMsgContainer}>
                <Text style={styles.errMsg}>
                  Username should be at least 5 letters long
                </Text>
              </View>
            ) : (
              <></>
            )}
            <AuthInputWithErrMsg
              InputIcon={
                <Fontisto
                  name="locked"
                  size={windowWidth * 0.07}
                  color="#FFF"
                />
              }
              SetInputState={setPassword}
              PlaceHolder="Enter password"
              PasswordMode={true}
            />
            {passwordErrMsgShow ? (
              <View style={styles.errMsgContainer}>
                <Text style={styles.errMsg}>
                  Password should be at least 8 letters long
                </Text>
              </View>
            ) : (
              <></>
            )}
            <AuthInputWithErrMsg
              InputIcon={
                <Fontisto
                  name="locked"
                  size={windowWidth * 0.07}
                  color="#FFF"
                />
              }
              SetInputState={setPasswordCheck}
              PlaceHolder="Enter password again"
              PasswordMode={true}
            />
            {passwordErrMsgShow ? (
              <View style={styles.errMsgContainer}>
                <Text style={styles.errMsg}>
                  Password should be at least 8 letters long
                </Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        </KeyboardAvoidingView>
        {/* Footer */}
        <View style={styles.bottomContainer}>
          <View style={styles.cuttingBottomContainer}>
            {/* Auth container */}
            <TouchableOpacity
              style={styles.authBtn}
              onPress={() => RegisterProcess()}
            >
              <Text style={styles.btnText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
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
  //Header
  topContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: windowHeight * 0.05,
  },
  goback: {
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
    marginRight: windowWidth * 0.88,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    color: "#FFF",
    fontFamily: "MajorMonoDisplay",
    fontSize: 54,
    paddingTop: windowHeight * 0.02,
  },
  //Body
  mainContainer: {
    width: windowWidth,
    height: windowHeight * 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: cornerRadius,
    borderBottomRightRadius: cornerRadius,
  },
  //Footer
  bottomContainer: {
    width: windowWidth,
    height: windowHeight * 0.3,
  },
  cuttingBottomContainer: {
    flex: 1,
    backgroundColor: backgroundColor,
    borderTopLeftRadius: cornerRadius,
    borderBottomRightRadius: windowHeight * 0.3,
    alignItems: "center",
    // justifyContent: "center",
  },
  authBtn: {
    width: windowWidth * 0.5,
    height: windowHeight * 0.07,
    marginTop: cornerRadius / 1.5,
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
  errMsgContainer: {
    width: windowWidth * 0.85,
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
  },
  errMsg: {
    color: "#F00",
  },
});
