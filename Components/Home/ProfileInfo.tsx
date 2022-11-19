import {
  paddingLarge,
  textLarge,
  textMedium,
  windowWidth,
} from "../../Constants/cssConst";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { AuthAPI, UserAPI } from "../../Constants/backendAPI";
import { REFRESH_KEY, CURRENTROOM_NAME } from "../../Constants/securestoreKey";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../../Types/Home/Profile/ProfileStackProps";
import {
  profileInfoStr,
  profileUpdateMode,
  profileUpdateTitle,
} from "../../Constants/ProfileConst";
import { AxiosResponse } from "axios";
import { UserProfileContainer } from "../../Types/Home/Profile/ProfileScreen";
import { FontAwesome } from "@expo/vector-icons";
import { commonStyle } from "../../Style/CommonStyle";

interface ProfileInfoProps {
  userId: string | undefined;
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
  navigation: NativeStackNavigationProp<
    ProfileStackProps,
    "ProfileScreen",
    undefined
  >;
}
const profileProcess = async (successCallBack: any) => {
  const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
  if (!localRefreshToken) {
    console.log("No local refresh token");
    return Alert.alert("Error", "No local refresh token");
  }
  customAxiosInstance({
    method: "get",
    url: `${UserAPI}/profile`,
  })
    .then((res) => {
      successCallBack(res);
    })
    .catch((e) => console.log(e.response.data));
};
// get current room name and set it to state
const getCurrentRoomName = async (
  setter: React.Dispatch<React.SetStateAction<string>>
) => {
  const tempRoomName = await SecureStore.getItemAsync(CURRENTROOM_NAME);
  setter(tempRoomName != null ? tempRoomName : profileInfoStr.notSet);
};
const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userId,
  setUserId,
  navigation,
}) => {
  //test use, remove later
  // SecureStore.setItemAsync(CURRENTROOM_ID, "1234");
  // SecureStore.setItemAsync(CURRENTROOM_NAME, "ルームA");

  const [userProfileContainer, setUseProfileContainer] =
    useState<UserProfileContainer>();
  const [userName, setUserName] = useState<string>("");
  const [currentRoomName, setCurrentRoomName] = useState<string>(
    profileInfoStr.notSet
  );
  getCurrentRoomName(setCurrentRoomName);
  //onload
  useEffect(() => {
    profileProcess((res: AxiosResponse<any, any>) => {
      try {
        //convert response to user profile type
        const resData = res.data.data.user as UserProfileContainer;
        //set user id in the parent screen
        console.log(resData);
        setUserId(resData.profile.userId);
        setUserName(resData.profile.username);
        //set user profile to state
        setUseProfileContainer(resData);
      } catch (e) {
        console.log(e);
      }
    });
  }, []);
  return (
    <View style={[commonStyle.mainContainer, { paddingTop: paddingLarge }]}>
      <View style={commonStyle.rowContainer}>
        <View style={styles.infoLeftView}>
          <FontAwesome
            name="user-circle"
            size={windowWidth * 0.18}
            color="black"
          />
        </View>
        <View style={styles.infoRightView}>
          <Text style={[commonStyle.textContainer, { fontSize: textLarge }]}>
            {userProfileContainer?.profile.username}
          </Text>
          <Text
            style={[commonStyle.textContainer, { fontSize: textLarge }]}
          >{`${profileInfoStr.IdHint}${profileInfoStr.IdMask}`}</Text>
        </View>
      </View>
      {/* membership display*/}
      <View style={[commonStyle.rowContainer, { paddingTop: paddingLarge }]}>
        <Text style={[commonStyle.textContainer, styles.membership]}>
          {profileInfoStr.membershipHint}
        </Text>
        <Text style={[commonStyle.textContainer, styles.membership]}>
          {profileInfoStr.membershipFree}
        </Text>
      </View>
      {/* */}
      <View style={commonStyle.rowContainer}>
        <Text style={[commonStyle.textContainer, styles.membership]}>
          {profileInfoStr.roomHint}
        </Text>
        <Text style={[commonStyle.textContainer, styles.membership]}>
          {currentRoomName}
        </Text>
      </View>
      <View style={[commonStyle.rowContainer, { paddingTop: paddingLarge }]}>
        <TouchableOpacity
          style={commonStyle.button_disable}
          onPress={() =>
            navigation.navigate("ProfileUpdateScreen", {
              mode: profileUpdateMode.personalInfo,
              userId: userId ? userId : "",
              userName: userName,
            })
          }
        >
          <Text style={commonStyle.textContainer}>
            {profileInfoStr.premiumBut}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={commonStyle.rowContainer}>
        <TouchableOpacity
          style={commonStyle.button_active}
          onPress={() =>
            navigation.navigate("ProfileUpdateScreen", {
              mode: profileUpdateMode.personalInfo,
              userId: userId ? userId : "",
              userName: userName,
            })
          }
        >
          <Text style={commonStyle.textContainer}>
            {profileUpdateTitle[profileUpdateMode.personalInfo]}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={commonStyle.rowContainer}>
        <TouchableOpacity
          style={commonStyle.button_active}
          onPress={() =>
            navigation.navigate("ProfileUpdateScreen", {
              mode: profileUpdateMode.password,
              userId: userId ? userId : "",
              userName: userName,
            })
          }
        >
          <Text style={commonStyle.textContainer}>
            {profileUpdateTitle[profileUpdateMode.password]}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoLeftView: {
    alignItems: "center",
    flex: 1,
  },
  infoRightView: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  membership: { flex: 1, textAlign: "center", fontSize: textMedium },
});
export default ProfileInfo;
