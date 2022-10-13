import React, { FunctionComponent, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import {
  backgroundColor,
  lightTextColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import UserItem from "./UserItem";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { RoomAPI } from "../../Constants/backendAPI";

interface UserListProps {}
const items = [
  {
    id: 1,
    title: "Item 1",
  },
  {
    id: 2,
    title: "Item 2",
  },
  {
    id: 3,
    title: "Item 3",
  },
  {
    id: 4,
    title: "Item 4",
  },
  {
    id: 5,
    title: "Item 5",
  },
  {
    id: 6,
    title: "Item 6",
  },
];
const UserList: FunctionComponent<UserListProps> = () => {
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
  //   const userItem = (props: any) => {
  //     return (
  //       <View>
  //         <Text>{item.title}</Text>
  //       </View>
  //     );
  //   };
  const userItemDetail = (item: any) => {
    <View>
      <Text>item.title</Text>
    </View>;
  };
  return (
    <View>
      <View style={[styles.userListView]}>
        <View style={{ alignItems: "flex-start", flex: 1 }}>
          <Text style={{ color: lightTextColor }}>ルームメイト</Text>
        </View>
        <View style={{ alignItems: "flex-end", flex: 1 }}>
          <TouchableOpacity>
            <FontAwesome
              name="plus"
              size={windowWidth * 0.05}
              color={lightTextColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.userListScrollView} nestedScrollEnabled={true}>
        <FlatList
          data={items}
          renderItem={({ item, index }) => {
            return <UserItem item={{ item }} />;
          }}
        ></FlatList>
      </ScrollView>
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  userListView: {
    flexDirection: "row",
  },
  userListScrollView: {
    height: windowHeight * 0.35,
  },
});
