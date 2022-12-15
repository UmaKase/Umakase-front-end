import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { RoomStackNavigationProps } from "../../../Types/Navigations/HomeDrawer/RoomStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Background from "../../../Components/Universal/Background";
import {
  lightTextColor,
  paddingLarge,
  paddingMedium,
  textLarge,
  textMedium,
  windowHeight,
  windowWidth,
} from "../../../Constants/cssConst";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
import { RoomAPI } from "../../../Constants/backendAPI";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import {
  CURRENTROOM_ID_KEY,
  CURRENTROOM_NAME_KEY,
} from "../../../Constants/securestoreKey";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { UserContext } from "../../../Context/UserContext";
import { profileScreenStr } from "../../../Constants/ProfileConst";
import { User } from "../../../Types/types";
import UserList from "../../../Components/Home/UserList";
type RoomScreenProps = NativeStackScreenProps<
  RoomStackNavigationProps,
  "RoomScreen"
>;
const RoomScreen: React.FC<RoomScreenProps> = ({ route, navigation }) => {
  // const [Room, setRoom] = useState<>();
  const { roomId } = route.params;

  const [roomIsUsed, setRoomIsUsed] = useState<boolean>(false);
  const [roomName, setRoomName] = useState();
  const [roomDescription, setRoomDescription] = useState(
    "this is room description."
  );
  const [roomMembers, setRoomMembers] = useState<User[]>([]);

  const settingRandomRoom = async () => {
    if (!roomName) {
      return console.log("error: there is no roomName data.");
    }
    await setItemAsync(CURRENTROOM_ID_KEY, roomId);
    await setItemAsync(CURRENTROOM_NAME_KEY, roomName);
    navigation.goBack();
    return Alert.alert(
      "Notification",
      `Change current room to ${roomName} success.`
    );
  };

  const deleteRoomFunction = () => {
    console.log(`delete room ${roomName}!`);
  };

  const checkRoomIsUsed = async () => {
    const currentRoom = await getItemAsync(CURRENTROOM_ID_KEY);
    if (currentRoom === roomId) {
      setRoomIsUsed(true);
    }
  };

  useEffect(() => {
    // get room list
    customAxiosInstance({
      method: "get",
      url: `${RoomAPI}/info/${roomId}`,
    })
      .then((res) => {
        console.log(res.data.data.room.user);
        setRoomName(
          res.data.data.room.name === "__default"
            ? "Default"
            : res.data.data.room.name
        );
        if (res.data.data.room.description) {
          setRoomDescription(res.data.data.room.description);
        }
        setRoomMembers(res.data.data.room.user);
      })
      .then(() => {
        checkRoomIsUsed();
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {};
  }, []);
  return (
    <Background headerOption={true}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.title}>
          <Text
            style={{
              fontSize: windowWidth * 0.08,
              color: lightTextColor,
              fontWeight: "500",
            }}
          >
            {roomName}
          </Text>
        </View>
        {roomName === "Default" ? (
          <></>
        ) : (
          <TouchableOpacity
            onPress={deleteRoomFunction}
            style={{ marginRight: windowWidth * 0.05 }}
          >
            <FontAwesome5 name="trash" size={textLarge} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.title, { height: windowHeight * 0.01 }]}></View>
      <View style={styles.title}>
        <Text
          style={{
            fontSize: textLarge,
            color: lightTextColor,
            fontWeight: "500",
          }}
        >
          {roomDescription}
        </Text>
      </View>
      <View style={[styles.title, { height: windowHeight * 0.1 }]}></View>
      <TouchableOpacity
        onPress={settingRandomRoom}
        style={styles.changeRoomButton}
      >
        <Text style={{ fontSize: textMedium, color: lightTextColor }}>
          {roomIsUsed ? "ルーム利用中" : "choose room"}
        </Text>
      </TouchableOpacity>
      <UserContext.Provider
        value={{
          users: roomMembers,
          headerTitle: profileScreenStr.userListHeaderText,
        }}
      >
        <UserList />
      </UserContext.Provider>
      {/* footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <FontAwesome name="home" size={windowWidth * 0.12} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("what is going to be next?")}
        >
          <FontAwesome
            name="arrow-circle-right"
            size={windowWidth * 0.12}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  // title part
  title: {
    height: windowHeight * 0.077,
    width: windowWidth * 0.9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: paddingLarge,
    marginVertical: windowWidth * 0.03,
  },
  changeRoomButton: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.08,
    // borderWidth: 1,
    // borderColor: "#FFF",
    borderRadius: windowWidth * 0.03,
    backgroundColor: "#ECAC72",
    marginTop: windowWidth * 0.01,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: windowHeight * 0.01,
    alignItems: "center",
    justifyContent: "center",
  },

  // footer
  // footer
  footer: {
    height: windowHeight * 0.07,
    width: windowWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: paddingLarge,
    marginTop: "auto",
    marginBottom: paddingMedium,
  },
  // modal
  modal: {
    flex: 0.75,
    backgroundColor: "#FFF",
    borderTopLeftRadius: windowWidth * 0.05,
    borderTopRightRadius: windowWidth * 0.05,
  },
});
// {"room": {"_count": {"foods": 5, "user": 1}, "createdAt": "2022-11-04T07:50:04.360Z", "creatorId": "1ec8cf54-d3e7-479a-beda-aead1e6ca141", "foods": [[Object], [Object], [Object], [Object], [Object]], "id": "a24b0645-9614-4c7b-bc13-a74967cbd086", "name": "__default", "updatedAt": "2022-11-04T07:50:04.360Z", "user": [[Object]]}}
