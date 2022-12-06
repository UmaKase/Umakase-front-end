import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { RoomStackNavigationProps } from "../../../../Types/Navigations/HomeDrawer/RoomStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Background from "../../../../Components/Universal/Background";
import {
  lightTextColor,
  paddingMedium,
  windowHeight,
  windowWidth,
} from "../../../../Constants/cssConst";
import customAxiosInstance from "../../../../Utils/customAxiosInstance";
import { RoomAPI } from "../../../../Constants/backendAPI";
type RoomScreenProps = NativeStackScreenProps<
  RoomStackNavigationProps,
  "RoomScreen"
>;
const RoomScreen: React.FC<RoomScreenProps> = ({ route, navigation }) => {
  // const [Room, setRoom] = useState<>();
  const { roomId } = route.params;

  useEffect(() => {
    // get room list
    customAxiosInstance({
      method: "get",
      url: `${RoomAPI}/info/${roomId}`,
    })
      .then((res) => {
        console.log(res.data.data);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
    return () => {};
  }, []);
  return (
    <Background headerOption={false}>
      <View style={styles.titleContainer}>
        <View
          style={{
            flex: 0.5,
            alignItems: "flex-start",
            justifyContent: "center",
            padding: paddingMedium,
          }}
        >
          <Text style={{ fontSize: windowWidth * 0.08, color: lightTextColor }}>
            Room name
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            alignItems: "flex-end",
            justifyContent: "center",
            padding: paddingMedium,
          }}
        ></View>
      </View>
    </Background>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  titleContainer: {
    width: windowWidth,
    height: windowHeight * 0.12,
    borderWidth: 1,
    flexDirection: "row",
  },
});
// {"room": {"_count": {"foods": 5, "user": 1}, "createdAt": "2022-11-04T07:50:04.360Z", "creatorId": "1ec8cf54-d3e7-479a-beda-aead1e6ca141", "foods": [[Object], [Object], [Object], [Object], [Object]], "id": "a24b0645-9614-4c7b-bc13-a74967cbd086", "name": "__default", "updatedAt": "2022-11-04T07:50:04.360Z", "user": [[Object]]}}
