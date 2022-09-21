import { DrawerActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import { windowHeight, windowWidth } from "../../Constants/cssConst";
import { HomeTabNavigationProps } from "../../Types/Navigations/HomeTab";
import { Fontisto } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

type RandomScreenProps = NativeStackScreenProps<
  HomeTabNavigationProps,
  "RandomScreen"
>;

const RandomScreen: React.FC<RandomScreenProps> = ({ navigation, route }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.background}>
          <CustomHeader
            toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          ></CustomHeader>
          <View style={styles.modeContainer}>
            <View style={styles.arrow}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("", "LEFT!");
                }}
              >
                <Fontisto
                  name="caret-left"
                  size={arrowSize}
                  color="#FFF"
                  style={{ borderWidth: 1 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modeBtnContainer}>
              <TouchableOpacity style={styles.modeBtn}></TouchableOpacity>
              <TouchableOpacity style={styles.modeBtn}></TouchableOpacity>
              <TouchableOpacity style={styles.modeBtn}></TouchableOpacity>
            </View>
            <View style={styles.arrow}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("", "RIGHT!");
                }}
              >
                <Fontisto
                  name="caret-right"
                  size={arrowSize}
                  color="#FFF"
                  style={{ borderWidth: 1 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default RandomScreen;

const arrowSize = windowHeight * 0.08;

const buttonSize = windowWidth * 0.15;

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
    borderWidth: 1,
  },
  arrow: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#900",
  },
  modeBtnContainer: {
    flex: 3,
    borderWidth: 1,
    borderColor: "#080",
    flexDirection: "row",
  },
  modeBtn: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    marginHorizontal: windowWidth * 0.02,
    borderWidth: 1,
    borderColor: "#FFF",
    backgroundColor: "#FFF",
  },
});
