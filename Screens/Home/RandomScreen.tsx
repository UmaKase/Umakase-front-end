import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import { windowHeight, windowWidth } from "../../Constants/cssConst";
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
import { setItemAsync } from "expo-secure-store";

type RandomScreenProps = DrawerScreenProps<
  HomeDrawerNavigationProps,
  "RandomScreen"
>;

const RandomScreen: React.FC<RandomScreenProps> = ({ navigation, route }) => {
  const [defaultRoomId, setDefaultRoomId] = useState();
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

  const getRoomInfo = async () => {
    // get default room id
    await customAxiosInstance({
      method: "get",
      url: `${RoomAPI}/`,
    })
      .then((getRooms) => {
        setDefaultRoomId(getRooms.data.data.rooms[0].room.id);
      })
      .catch((e) => {
        console.log("get rooms Error:", e.response.data.message);
        return Alert.alert("Error", "not getting default room!");
      });
  };

  useEffect(() => {
    getRoomInfo().then(() => {
      setFetching(false);
    });
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
                onPress={() => console.log(defaultRoomId)}
              >
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
