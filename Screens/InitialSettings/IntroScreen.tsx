import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../types/Navigations/InitialSteps";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";

type Props = NativeStackScreenProps<InitialStepsProps, "IntroScreen">;

const IntroScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaProvider>
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
          <TouchableOpacity style={styles.loginLink} onPress={() => {}}>
            <Text style={styles.loginLinkFont}>アカウントをログイン</Text>
          </TouchableOpacity>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <View style={styles.sideContainer}></View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() =>
                navigation.dispatch(
                  CommonActions.reset({
                    routes: [{ name: "HomeDrawerNavigation" }],
                  })
                )
              }
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
