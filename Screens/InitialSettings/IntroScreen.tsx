import { Alert, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { backgroundColor, windowHeight, windowWidth } from "../../Constants/cssConst";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { CONFIG_KEY, INITIAL_STAGE_FOOD, INITIAL_STAGE_TAG } from "../../Constants/securestoreKey";
import useSubmit from "../../Hooks/InitialStage/useSubmit";
import SubmitStatus from "../../Components/InitialStep/SubmitStatus";

type Props = NativeStackScreenProps<InitialStepsProps, "IntroScreen">;

const IntroScreen: React.FC<Props> = ({ navigation }) => {
  const [submitStart, loadingText, submit] = useSubmit();

  // SECTION Check if user have previous setting
  async function checkIfPreviousSetting() {
    const prevTag = await getItemAsync(INITIAL_STAGE_TAG);
    const prevFood = await getItemAsync(INITIAL_STAGE_FOOD);
    if (prevTag || prevFood) {
      Alert.alert("Notify", "You have a previous setting been saved, do you like to proceed with the previous setting?", [
        {
          text: "No",
          onPress: (async () => {
            await deleteItemAsync(INITIAL_STAGE_TAG);
            await deleteItemAsync(INITIAL_STAGE_FOOD);
          }),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: (async () => {
            navigation.navigate("SelectTagScreen");
          }),
          style: "default"
        }
      ]);
    }
  }
  // !SECTION

  const accountLoginHandler = () => {
    setItemAsync(CONFIG_KEY, "Completed");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "AuthNavigation" }],
      })
    );
  };

  useEffect(() => {
    checkIfPreviousSetting();
  }, [])

  // SECTION components for IntroScreen
  const Header: React.FC = () => {
    return <View style={styles.header}>
      <View style={styles.iconConatiner}>
        <Image
          source={require("../../Image/Umakase.png")}
          style={styles.icon}
        ></Image>
      </View>
      <View style={styles.headLine}>
        <Text style={styles.headLineText}>ようこそ！</Text>
      </View>
    </View>
  }

  const Body: React.FC = () => {
    return <View style={styles.directionsContainer}>
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
  }

  const LoginLink: React.FC = () => {
    return <View style={styles.linkContainer}>
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => accountLoginHandler()}
      >
        <Text style={styles.loginLinkFont}>アカウントをログイン</Text>
      </TouchableOpacity>
    </View>
  }

  const Footer: React.FC = () => {
    return <View style={styles.footer}>
      <View style={styles.sideContainer}></View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => submit({})}
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
  }
  // !SECTION ========================================================

  return (
    <SafeAreaProvider style={{ alignItems: "center", justifyContent: "center", backgroundColor: submitStart ? backgroundColor : "#FFF" }}>
      {submitStart ? (
        <SubmitStatus loadingText={loadingText} />
      ) : (
        <SafeAreaView style={styles.background}>
          <Header />
          <Body />
          <LoginLink />
          <Footer />
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
