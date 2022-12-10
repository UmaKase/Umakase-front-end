import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  backgroundColor,
  darkerBackgroundColor,
  windowHeight,
  windowWidth,
} from "../../../Constants/cssConst";
import CustomHeader from "../../../Components/HomeDrawer/CustomHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../../Types/Navigations/HomeDrawer/RoomStack";
import { DrawerActions } from "@react-navigation/native";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
import { RoomAPI } from "../../../Constants/backendAPI";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import RoomBox from "../../../Components/Home/Room/RoomBox";
import CenterActivityIndicator from "../../../Components/Universal/CenterActivityIndicator";

type Props = NativeStackScreenProps<RoomStackNavigationProps, "RoomListScreen">;

const RoomListScreen: React.FC<Props> = ({ navigation, route }) => {
  const [fetching, setFetching] = useState(true);
  const [rooms, setRooms] = useState<RoomListRoomInfo[]>();
  const roomsLayout = (length: number) => {
    switch (length) {
      case 1: {
        return windowHeight * 0.2;
      }
      case 2: {
        return windowHeight * 0.4;
      }
      default: {
        return windowHeight * 0.6;
      }
    }
  };
  useEffect(() => {
    const unSubscribe = navigation.addListener("focus", () => {
      // get room list
      customAxiosInstance({
        method: "get",
        url: `${RoomAPI}/`,
      })
        .then((res) => {
          console.log(res.data.data.rooms);
          setRooms(res.data.data.rooms);
          setFetching(false);
        })
        .catch((e) => {
          console.log(e.response.data);
          return Alert.alert("Error", "Getting room list failed.");
        });
    });
    return unSubscribe;
  }, [navigation]);

  const createRoom = () => {
    navigation.navigate("RoomConfigSettingScreen");
  };
  const goRoom = (roomId: string) => {
    navigation.navigate("RoomScreen", { roomId: roomId });
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.background}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.openDrawer)}
        ></CustomHeader>
        {fetching ? (
          <CenterActivityIndicator size={"large"} color="#FFF" />
        ) : (
          <>
            <View style={{ height: roomsLayout(rooms!.length) }}>
              <FlatList
                data={rooms}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                  return (
                    <RoomBox
                      key={item.room.id}
                      onPressHandler={() => goRoom(item.room.id)}
                      roomName={item.room.name}
                    />
                  );
                }}
              />
            </View>
            <View style={{ borderColor: "#000" }}>
              <CreateRoomBlock createRoomFunc={createRoom} />
            </View>
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const borderRadius = windowWidth * 0.02;
const innerContainerHeight = windowHeight * 0.18 * 0.6;
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
        backgroundColor: darkerBackgroundColor,
        alignItems: "center",
        justifyContent: "center",
        marginTop: windowHeight * 0.02,
      }}
    >
      <Entypo
        name="circle-with-plus"
        size={windowWidth * 0.13}
        color={backgroundColor}
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
