import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { backgroundColor, lightTextColor, paddingLarge, paddingMedium, paddingSmall, textMedium, windowHeight, windowWidth } from "../../Constants/cssConst";
import UserItem from "./UserItem";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { RoomAPI } from "../../Constants/backendAPI";
import { UserContext } from "../../Context/UserContext";
import { Room } from "../../Types/types";

interface UserListProps {}
const UserList: FunctionComponent<UserListProps> = () => {
  const [roomId, setRoomId] = useState("");
  //get default room id from api
  useEffect(() => {
    customAxiosInstance({
      method: "get",
      url: `${RoomAPI}/info/:id`,
    })
      .then((res) => {
        console.log("response status:", res.status);
        console.log(res.data.data);
        const room = res.data.data as Room;
        setRoomId(room.id);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const { users, headerTitle, handleAdd } = useContext(UserContext);
  //user list`s header JSX element
  const userListHeader = () => (
    <View style={styles.userListView}>
      <View style={styles.headerLeftView}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>
      <View style={[styles.headerRightView, handleAdd ? {} : { display: "none" }]}>
        <TouchableOpacity
          onPress={() => {
            handleAdd ? handleAdd(roomId) : {};
          }}
        >
          <FontAwesome name="plus" size={windowWidth * 0.05} color={lightTextColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View>
      <FlatList
        data={users}
        renderItem={({ item, index }) => {
          return <UserItem item={{ item }} />;
        }}
        ListHeaderComponent={userListHeader}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  userListView: {
    flexDirection: "row",
    paddingBottom: paddingSmall,
    paddingTop: paddingSmall + paddingSmall,
    paddingLeft: paddingLarge,
    paddingRight: paddingLarge,
    width: windowWidth,
    backgroundColor: backgroundColor,
  },
  headerTitle: {
    color: lightTextColor,
    fontSize: textMedium,
  },
  headerLeftView: { alignItems: "flex-start", flex: 1 },
  headerRightView: { alignItems: "flex-end", flex: 1 },
  userList: {
    height: windowHeight * 0.5,
  },
});
