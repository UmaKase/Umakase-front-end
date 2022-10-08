import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import {
  backgroundColor,
  lightTextColor,
  windowWidth,
} from "../../Constants/cssConst";
import UserItem from "./UserItem";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

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
];
const UserList: FunctionComponent<UserListProps> = () => {
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
      <FlatList
        data={items}
        renderItem={({ item, index }) => {
          return <UserItem item={{ item }} />;
        }}
      ></FlatList>
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  userListView: {
    flexDirection: "row",
  },
});
