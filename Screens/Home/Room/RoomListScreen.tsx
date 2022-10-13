import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../../Constants/cssConst";
import CustomHeader from "../../../Components/HomeDrawer/CustomHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../../Types/Navigations/RoomStack";
import { DrawerActions } from "@react-navigation/native";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
import { RoomAPI } from "../../../Constants/backendAPI";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<RoomStackNavigationProps, "RoomListScreen">;

const RoomListScreen: React.FC<Props> = ({ navigation, route }) => {
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
        console.log(e.response.data);
      });
    // get room list
    customAxiosInstance({
      method: "get",
      url: `${RoomAPI}/`,
    })
      .then((res) => {
        console.log(res.data.data);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }, []);

  const createRoom = () => {
    console.log("create Room!");
  };
  const getRoomInfo = () => {
    console.log("get room info");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.background}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.openDrawer)}
        ></CustomHeader>
        <RoomBlock getRoomInfo={getRoomInfo} />
        <RoomBlock getRoomInfo={getRoomInfo} />
        <CreateRoomBlock createRoomFunc={createRoom} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const borderRadius = windowWidth * 0.02;
const innerContainerHeight = windowHeight * 0.18 * 0.6;
// room block ====================================================================
type RoomBlock = {
  getRoomInfo: () => void;
};
const RoomBlock: React.FC<RoomBlock> = ({ getRoomInfo }) => {
  const image = require("../../../Image/TempRoomBlockImage.png");
  return (
    <TouchableOpacity
      onPress={() => getRoomInfo()}
      style={{
        width: windowWidth * 0.85,
        height: windowHeight * 0.18,
        borderRadius: borderRadius,
        marginTop: windowHeight * 0.02,
      }}
    >
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={{ flex: 1 }}
        imageStyle={{ borderRadius: borderRadius }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: borderRadius,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: innerContainerHeight,
              flexDirection: "row",
              paddingHorizontal: windowWidth * 0.05,
            }}
          >
            <FontAwesome
              name="user-circle"
              size={innerContainerHeight}
              color="black"
            />
            <View style={{ flex: 1, paddingLeft: windowWidth * 0.04 }}>
              <Text
                style={{
                  color: "#ECAC72",
                  fontSize: innerContainerHeight / 3.8,
                  fontWeight: "600",
                }}
              >
                Room Name
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <FontAwesome
                  name="user-circle"
                  size={innerContainerHeight / 2}
                  color="black"
                />
                <FontAwesome
                  name="user-circle"
                  size={innerContainerHeight / 2}
                  color="black"
                  style={{ paddingLeft: windowWidth * 0.04 }}
                />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// create room block ================================================================
type CreateRoomBlockProps = {
  createRoomFunc: () => void;
};
const CreateRoomBlock: React.FC<CreateRoomBlockProps> = ({
  createRoomFunc,
}) => {
  return (
    <TouchableOpacity
      onPress={() => createRoomFunc()}
      style={{
        width: windowWidth * 0.85,
        height: windowHeight * 0.18,
        borderRadius: borderRadius,
        backgroundColor: "#ECAC72",
        alignItems: "center",
        justifyContent: "center",
        marginTop: windowHeight * 0.02,
      }}
    >
      <Entypo
        name="circle-with-plus"
        size={windowWidth * 0.13}
        color="#FAC595"
      />
      <Text
        style={{
          fontSize: windowWidth * 0.05,
          color: "#FFF",
          marginTop: windowHeight * 0.01,
        }}
      >
        新しい部屋を作成
      </Text>
    </TouchableOpacity>
  );
};

export default RoomListScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: "center",
  },
});
