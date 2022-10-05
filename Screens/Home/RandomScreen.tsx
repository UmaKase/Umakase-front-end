import { DrawerActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import { windowHeight, windowWidth } from "../../Constants/cssConst";
import { HomeTabNavigationProps } from "../../Types/Navigations/HomeTab";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { RoomAPI } from "../../Constants/backendAPI";

type RandomScreenProps = NativeStackScreenProps<
  HomeTabNavigationProps,
  "RandomScreen"
>;

const RandomScreen: React.FC<RandomScreenProps> = ({ navigation, route }) => {
  useEffect(() => {
    customAxiosInstance({
      method: "get",
      url: `${RoomAPI}/info/:id`,
    })
      .then((res) => {
        console.log("response status:", res.status);
        console.log(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.background}>
          {/* header =========================================== */}
          <CustomHeader
            toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          ></CustomHeader>
          {/* mode  =========================================== */}
          <View style={styles.modeContainer}>
            {/* left arrow */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert("", "LEFT!");
              }}
            >
              <Fontisto name="caret-left" size={arrowSize} color="#FFF" />
            </TouchableOpacity>
            {/* mode btn */}
            <TouchableOpacity style={styles.modeBtn}>
              <FontAwesome5
                name="play"
                size={(buttonSize * 2) / 5}
                color="#FFF"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeBtn}>
              <FontAwesome5 name="hotjar" size={buttonSize / 2} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeBtn}>
              <Entypo name="back-in-time" size={buttonSize / 2} color="#FFF" />
            </TouchableOpacity>
            {/* right arrow */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert("", "RIGHT!");
              }}
            >
              <Fontisto name="caret-right" size={arrowSize} color="#FFF" />
            </TouchableOpacity>
          </View>
          {/* start btn =========================================== */}
          <View style={styles.startContainer}>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={{ fontSize: windowWidth * 0.1, color: "#FFF" }}>
                Start
              </Text>
            </TouchableOpacity>
          </View>
          {/* notify text */}
          <View
            // prettier-ignore
            style={{flex: 0.3, alignItems: "center", justifyContent: "center",}}
          >
            <Text style={{ fontSize: windowWidth * 0.07, color: "#FFF" }}>
              まず献立を決めます
            </Text>
          </View>
          {/* bottom part */}
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity>
              <FontAwesome
                name="angle-double-down"
                size={(buttonSize * 2) / 3}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default RandomScreen;

const arrowSize = windowHeight * 0.08;

const buttonSize = windowWidth * 0.17;

const startBtnSize = windowWidth * 0.4;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAC595",
  },
  background: {
    flex: 1,
  },
  modeContainer: {
    width: windowWidth,
    height: windowHeight * 0.13,
    marginVertical: windowHeight * 0.02,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  modeBtn: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    marginHorizontal: windowWidth * 0.02,
    borderWidth: 5,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  startContainer: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  startBtn: {
    width: startBtnSize,
    height: startBtnSize,
    borderRadius: startBtnSize / 2,
    borderWidth: 10,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
