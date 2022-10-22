import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI } from "../../Constants/backendAPI";
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
import { profileScreenStr } from "../../Constants/profileConst";
import { commonStyle } from "../../Style/CommonStyle";
type ProfileScreenProps = NativeStackScreenProps<
  ProfileStackProps,
  "ProfileScreen"
>;
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
  //get user id
  useEffect(() => {
    console.log("Hello:" + userId);
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
              users: users,
              headerTitle: profileScreenStr.userListHeaderText,
              handleAdd: () => {
                console.log("handleAdd");
              },
              handleRemove: (id: string) => {
                console.log(`handleRemove,id:${id}`);
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
