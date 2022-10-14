import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { setItemAsync } from "expo-secure-store";
import axios from "axios";
import { AuthAPI, RoomAPI } from "../../Constants/backendAPI";
import {
  ACCESS_KEY,
  CONFIG_KEY,
  REFRESH_KEY,
  TEMPUSERID_KEY,
  TEMPUSERPASS_KEY,
} from "../../Constants/securestoreKey";
import customAxiosInstance from "../../Utils/customAxiosInstance";

type Props = NativeStackScreenProps<InitialStepsProps, "IntroScreen">;

const IntroScreen: React.FC<Props> = ({ navigation }) => {
  const [startSubmit, setStartSubmit] = useState(false);
  const [loadingText, setLoadingText] = useState("Creating new account");
  const accountLoginHandler = () => {
    setItemAsync(CONFIG_KEY, "Completed");
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: "AuthNavigation" }],
      })
    );
  };
  const skipSettingFunction = async () => {
    setStartSubmit(true);
    let tempData = undefined;
    let loginFlag = false;
    // reset function
    // phase 1 register a temp user
    try {
      const res = await axios({
        method: "post",
        url: `${AuthAPI}/register`,
        data: {
          isTemp: true,
        },
      });
      setItemAsync(TEMPUSERID_KEY, res.data.data.tmpId);
      setItemAsync(TEMPUSERPASS_KEY, res.data.data.tmpPass);
      tempData = {
        id: res.data.data.tmpId,
        pass: res.data.data.tmpPass,
      };
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 1");
    }

    // phase 2 login with temp user
    // prettier-ignore
    if(tempData === undefined){return console.log("Submit process failed with tempUserRegisterDate === undifined.")}
    setLoadingText("Login process");
    try {
      const res = await axios({
        method: "post",
        url: `${AuthAPI}/login`,
        data: {
          username: tempData.id,
          password: tempData.pass,
        },
      });
      setItemAsync(ACCESS_KEY, res.data.data.accessToken);
      setItemAsync(REFRESH_KEY, res.data.data.refreshToken);
      loginFlag = true;
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 2");
    }

    // phase 3
    // prettier-ignore
    if(!loginFlag){return console.log("Submit process failed with liginWithTempUser === undefined.")}
    setLoadingText("Creating user setting");
    try {
      const res = await customAxiosInstance({
        method: "post",
        url: `${RoomAPI}/new`,
        data: {
          isDefaultRoom: true,
          foodIds: [],
          name: "__default",
        },
      });
      console.log(res.data.data);
      setItemAsync(CONFIG_KEY, "Completed");
      console.log("saved");
      navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: "HomeDrawerNavigation" }],
        })
      );
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 3");
    }
  };
  return (
    <SafeAreaProvider
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: startSubmit ? backgroundColor : "#FFF",
      }}
    >
      {startSubmit ? (
        <>
          <ActivityIndicator size="large" color="#FFF"></ActivityIndicator>
          <Text
            style={{
              color: "#FFF",
              fontSize: windowWidth * 0.05,
              marginTop: windowHeight * 0.03,
            }}
          >
            {loadingText}
          </Text>
        </>
      ) : (
        <SafeAreaView style={styles.background}>
          {/* header */}
          <View style={styles.header}>
            <View style={styles.iconConatiner}>
              <Image
                source={require("../../image/umakase.png")}
                style={styles.icon}
              ></Image>
            </View>
            <View style={styles.headLine}>
              <Text style={styles.headLineText}>ようこそ！</Text>
            </View>
          </View>
          {/* body */}
          <View style={styles.directionsContainer}>
            <Text style={styles.directionsFont}>
              Umakaseをご使用いただき、{"\n"}
              ありがとうございます。{"\n"}
              これからお気入り料理の設定を{"\n"}
              行います。{"\n"}
              右ボタンをクリックして設定を{"\n"}
              始めます。{"\n"}
              スキップボタンをクリックして{"\n"}
              設定をあと回します。
            </Text>
          </View>
          <View style={styles.linkContainer}>
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => accountLoginHandler()}
            >
              <Text style={styles.loginLinkFont}>アカウントをログイン</Text>
            </TouchableOpacity>
          </View>
          {/* footer */}
          <View style={styles.footer}>
            <View style={styles.sideContainer}></View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => skipSettingFunction()}
              >
                <Text style={styles.skipBtnText}>スキップ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sideContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("SelectTagScreen")}
              >
                <FontAwesome
                  name="arrow-circle-right"
                  size={windowWidth * 0.145}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  // header
  header: {
    width: windowWidth,
    height: windowHeight * 0.15,
    alignItems: "center",
    flexDirection: "row",
  },
  iconConatiner: {
    height: windowHeight * 0.11,
    width: windowWidth * 0.3,
    alignItems: "flex-end",
  },
  icon: {
    height: windowHeight * 0.11,
    width: windowHeight * 0.11,
    resizeMode: "contain",
  },
  headLine: {
    height: windowHeight * 0.11,
    width: windowWidth * 0.7,
    justifyContent: "center",
  },
  headLineText: {
    color: "#FFF",
    fontSize: windowWidth * 0.1,
  },
  // directions
  directionsContainer: {
    width: windowWidth,
    height: windowHeight * 0.4,
    justifyContent: "center",
    paddingLeft: windowWidth * 0.08,
  },
  directionsFont: {
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    lineHeight: windowHeight * 0.05,
  },
  //login link
  linkContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    justifyContent: "center",
    paddingLeft: windowWidth * 0.08,
  },
  loginLink: {},
  loginLinkFont: {
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    textDecorationLine: "underline",
  },
  //footer
  footer: {
    height: windowHeight * 0.15,
    width: windowWidth,
    flexDirection: "row",
  },
  sideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  btnContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  skipBtn: {
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    borderRadius: windowWidth * 0.04,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  skipBtnText: {
    fontSize: windowWidth * 0.05,
    color: backgroundColor,
  },
});
