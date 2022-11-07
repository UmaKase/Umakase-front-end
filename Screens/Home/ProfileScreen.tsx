import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI, RoomAPI } from "../../Constants/backendAPI";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY, REFRESH_KEY } from "../../Constants/securestoreKey";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import { backgroundColor } from "../../Constants/cssConst";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import ProfileInfo from "../../Components/Home/ProfileInfo";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../../Types/Home/Profile/ProfileStackProps";
import UserList from "../../Components/Home/UserList";
import { UserContext } from "../../Context/UserContext";
import { User } from "../../Types/types";
import { profileScreenStr } from "../../Constants/ProfileConst";
import { commonStyle } from "../../Style/CommonStyle";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { postRoomEvent } from "../../Constants/paramConst";
type ProfileScreenProps = NativeStackScreenProps<
  ProfileStackProps,
  "ProfileScreen"
>;
//get default room ID of user
const getRoomIdCall = async (successCallBack: any, failCallback: any) => {
  // get default room id
  await customAxiosInstance({
    method: "get",
    url: `${RoomAPI}/`,
  })
    .then((getRooms) => {
      successCallBack(getRooms);
    })
    .catch((e) => {
      console.log("get rooms Error:", e.response.data.message);
      failCallback(e);
      return Alert.alert("Error", "not getting default room!");
    });
};
//get Users in the default room by room ID
const getRoomInfoCall = async (
  id: string,
  successCallBack: any,
  failCallback: any
) => {
  // get default room id
  await customAxiosInstance({
    method: "get",
    url: `${RoomAPI}/info/${id}`,
  })
    .then((getUsers) => {
      successCallBack(getUsers);
    })
    .catch((e) => {
      console.log("get rooms Error:", e.response.data.message);
      failCallback(e);
      return Alert.alert("Error", "not getting default room!");
    });
};
//add user into the default room
const addUserCall = async (
  id: string,
  user: User,
  successCallBack: any,
  failCallback: any
) => {
  await customAxiosInstance({
    method: "post",
    url: `${RoomAPI}/event`,
    data: {
      roomId: id,
      event: postRoomEvent.addMember,
      newRoomies: user,
    },
  })
    .then((res) => {
      successCallBack(res);
    })
    .catch((e) => {
      failCallback(e);
    });
};
//remove user into the default room
const removeUserCall = async (
  id: string,
  user: User,
  successCallBack: any,
  failCallback: any
) => {
  await customAxiosInstance({
    method: "post",
    url: `${RoomAPI}/event`,
    data: {
      roomId: id,
      event: postRoomEvent.removeMember,
      removeRoomies: user,
    },
  })
    .then((res) => {
      successCallBack(res);
    })
    .catch((e) => {
      failCallback(e);
    });
};
const users: User[] = [
  {
    id: "1",
    createdAt: "2022-10-18 00:00",
    updatedAt: "2022-10-18 00:00",
    password: "****",
    profile: {
      id: "1",
      userId: "1",
      username: "username",
      firstname: "First",
      lastname: "Last",
    },
  },
  {
    id: "2",
    createdAt: "2022-10-18 00:00",
    updatedAt: "2022-10-18 00:00",
    password: "****",
    profile: {
      id: "2",
      userId: "2",
      username: "username",
      firstname: "Test user",
      lastname: "Two",
    },
  },
];
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [userId, setUserId] = useState<string>();
  const [defaultRoomId, setDefaultRoomId] = useState<string>();
  const [RoomUsers, setRoomUsers] = useState<User[]>([]);
  //get user id
  useEffect(() => {
    getRoomIdCall(
      (getRooms: any) => {
        setDefaultRoomId(getRooms.data.data.rooms[0].room.id);
        if (defaultRoomId)
          getRoomInfoCall(
            defaultRoomId,
            (getUsers: any) => {
              console.log(getUsers.data.data.room.user);
              var returnUser: User[] = getUsers.data.data.room.user as User[];
              setRoomUsers(returnUser);
            },
            () => {}
          );
      },
      () => {}
    );
    console.log(`user:${userId},room${defaultRoomId}`);
  }, [setUserId]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={commonStyle.safeArea}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        ></CustomHeader>
        <ProfileInfo
          userId={userId}
          setUserId={setUserId}
          navigation={navigation}
        />
        <View style={{ flex: 1 }}>
          <UserContext.Provider
            value={{
              users: RoomUsers,
              headerTitle: profileScreenStr.userListHeaderText,
              handleAdd: () => {
                if (defaultRoomId) {
                  console.log("handleAdd");
                  addUserCall(
                    defaultRoomId,
                    {} as User,
                    () => {},
                    () => {}
                  );
                }
              },
              handleRemove: (user: User) => {
                if (defaultRoomId) {
                  console.log(`handleRemove,user:${user}`);
                  removeUserCall(
                    defaultRoomId,
                    user,
                    () => {},
                    () => {}
                  );
                }
              },
            }}
          >
            <UserList />
          </UserContext.Provider>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default ProfileScreen;
