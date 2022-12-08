import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import {
  lightTextColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { RoomAPI } from "../../Constants/backendAPI";
import { HomeDrawerNavigationProps } from "../../Types/Navigations/HomeDrawer";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import {
  CURRENTROOM_ID,
  CURRENTROOM_NAME,
} from "../../Constants/securestoreKey";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RandomStackNavigationProps } from "../../Types/Navigations/HomeDrawer/RandomStack";

type RandomScreenProps = NativeStackScreenProps<
  RandomStackNavigationProps,
  "RandomScreen"
>;
// type RandomScreenProps = DrawerScreenProps<
//   HomeDrawerNavigationProps,
//   "RandomScreen"
// >;

const RandomScreen: React.FC<RandomScreenProps> = ({ navigation, route }) => {
  const [currentRoomId, setCurrentRoomId] = useState<string>("");
  const [currentRoomName, setCurrentRoomName] = useState<string>("");
  const [fetching, setFetching] = useState(true);
  const [mode, setMode] = useState(1);

  const randomFunction = () => {
    switch (mode) {
      case 1: {
        console.log(1);
        break;
      }
      case 2: {
        console.log(2);
        break;
      }
      case 3: {
        console.log(3);
        break;
      }
    }
  };

  const getCurrentRoomInfo = async () => {
    // getting room id and name from the SecureStore
    const roomId = await getItemAsync(CURRENTROOM_ID);
    const roomName = await getItemAsync(CURRENTROOM_NAME);
    if (!roomId || !roomName) {
      return Alert.alert("Error", "Cannot get room id and name!");
    }
    setCurrentRoomId(roomId);
    setCurrentRoomName(roomName);
  };

  useEffect(() => {
    getCurrentRoomInfo();
    setFetching(false);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {fetching ? (
          <ActivityIndicator size="large" color="#FFF"></ActivityIndicator>
        ) : (
          <View style={styles.background}>
            {/* header =========================================== */}
            <CustomHeader
              toggleMenu={() =>
                navigation.dispatch(DrawerActions.toggleDrawer())
              }
            ></CustomHeader>
            {/* mode  =========================================== */}
            <View style={styles.modeContainer}>
              {/* left arrow */}
              <TouchableOpacity
                onPress={() => {
                  if (mode !== 1) {
                    setMode((prev) => prev - 1);
                  }
                }}
              >
                <Fontisto name="caret-left" size={arrowSize} color="#FFF" />
              </TouchableOpacity>
              {/* mode btn */}
              {/* start btn */}
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  mode === 1 && { borderColor: "#87A7E5" },
                ]}
                onPress={() => setMode(1)}
              >
                <FontAwesome5
                  name="play"
                  size={(buttonSize * 2) / 5}
                  color={mode === 1 ? "#87A7E5" : "#FFF"}
                />
              </TouchableOpacity>
              {/* fire btn */}
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  mode === 2 && { borderColor: "#87A7E5" },
                ]}
                onPress={() => setMode(2)}
              >
                <FontAwesome5
                  name="hotjar"
                  size={buttonSize / 2}
                  color={mode === 2 ? "#87A7E5" : "#FFF"}
                />
              </TouchableOpacity>
              {/* time btn */}
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  mode === 3 && { borderColor: "#87A7E5" },
                ]}
                onPress={() => setMode(3)}
              >
                <Entypo
                  name="back-in-time"
                  size={buttonSize / 2}
                  color={mode === 3 ? "#87A7E5" : "#FFF"}
                />
              </TouchableOpacity>
              {/* right arrow */}
              <TouchableOpacity
                onPress={() => {
                  if (mode !== 3) {
                    setMode((prev) => prev + 1);
                  }
                }}
              >
                <Fontisto name="caret-right" size={arrowSize} color="#FFF" />
              </TouchableOpacity>
            </View>
            {/* start btn =========================================== */}
            <View style={styles.startContainer}>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => console.log("Start")}
              >
                <Text style={{ fontSize: windowWidth * 0.1, color: "#FFF" }}>
                  Start
                </Text>
              </TouchableOpacity>
            </View>
            {/* notify text */}
            <View
              // prettier-ignore
              style={{flex: 0.3, alignItems: "center", justifyContent: "center",borderWidth:1}}
            >
              <Text style={{ fontSize: windowWidth * 0.07, color: "#FFF" }}>
                まず献立を決めます
              </Text>
              <Text
                style={{
                  color: lightTextColor,
                  fontSize: windowWidth * 0.04,
                  marginVertical: windowHeight * 0.01,
                  width: windowWidth * 0.5,
                  flexWrap: "wrap",
                }}
              >{`Room id: ${currentRoomId}`}</Text>
              <Text
                style={{ color: lightTextColor, fontSize: windowWidth * 0.04 }}
              >{`Room name: ${currentRoomName}`}</Text>
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
        )}
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
