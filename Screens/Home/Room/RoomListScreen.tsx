import { StyleSheet, Text, View } from "react-native";
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
import { Entypo } from "@expo/vector-icons";
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
        console.log(e);
      });
  }, []);

  const createRoom = () => {
    console.log("create Room!");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.background}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.openDrawer)}
        ></CustomHeader>
        <CreateRoomBlock createRoomFunc={createRoom}></CreateRoomBlock>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

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
        borderRadius: windowWidth * 0.02,
        backgroundColor: "#ECAC72",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: windowHeight * 0.01,
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
