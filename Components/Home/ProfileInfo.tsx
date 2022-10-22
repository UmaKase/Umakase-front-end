import {
  drawerColor,
  paddingLarge,
  paddingMedium,
  textLarge,
  textMedium,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import React, { useEffect, useState } from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { AuthAPI, UserAPI } from "../../Constants/backendAPI";
import { ACCESS_KEY, REFRESH_KEY } from "../../Constants/securestoreKey";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../../Types/Home/Profile/ProfileStackProps";
import {
  profileInfoStr,
  profileUpdateMode,
} from "../../Constants/profileConst";
import { CommonActions } from "@react-navigation/native";
import axios, { AxiosResponse } from "axios";
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
let imgUrl: string = "";
let imgSrc: ImageSourcePropType; //profile process
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
const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userId,
  setUserId,
  navigation,
}) => {
  //logout process
  const logoutProcess = async () => {
    const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!localRefreshToken) {
      console.log("No local refresh token");
      return Alert.alert("Error", "No local refresh token");
    }
    axios({
      method: "post",
      url: `${AuthAPI}/token/logout`,
      headers: { Authorization: `Bearer ${localRefreshToken}` },
    }).then(async (response) => {
      if (response.status) {
        await SecureStore.deleteItemAsync(ACCESS_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        navigation.dispatch(
          CommonActions.reset({ routes: [{ name: "AuthNavigation" }] })
        );
      } else {
        return Alert.alert("Error", "logout process failed.");
      }
    });
  };
  const [userProfileContainer, setUseProfileContainer] =
    useState<UserProfileContainer>();
  const [feeding, setFeeding] = useState<boolean>();
  imgUrl = require("../../image/umakase.png");
  //onload
  useEffect(() => {
    profileProcess((res: AxiosResponse<any, any>) => {
      try {
        //convert response to user profile type
        const resData = res.data.data.user as UserProfileContainer;
        //set user id in the parent screen
        setUserId(resData.profile.userId);
        //set user profile to state
        setUseProfileContainer(resData);
      } catch (e) {
        console.log(e);
      }
    });
  }, []);
  return (
    <View style={[commonStyle.mainContainer, { flex: 0 }]}>
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
      <View style={commonStyle.rowContainer}>
        <Text style={[commonStyle.textContainer, styles.membership]}>
          {profileInfoStr.membershipHint}
        </Text>
        <Text style={[commonStyle.textContainer, styles.membership]}>
          {profileInfoStr.membershipFree}
        </Text>
      </View>
      <View style={commonStyle.rowContainer}>
        <TouchableOpacity
          style={commonStyle.button_disable}
          onPress={() =>
            navigation.push("ProfileUpdateScreen", {
              mode: profileUpdateMode.email,
              userId: userId ? userId : "",
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
            navigation.push("ProfileUpdateScreen", {
              mode: profileUpdateMode.password,
              userId: userId ? userId : "",
            })
          }
        >
          <Text style={commonStyle.textContainer}>
            {profileInfoStr.passwordBut}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={commonStyle.rowContainer}>
        <TouchableOpacity
          style={commonStyle.button_active}
          onPress={() =>
            navigation.push("ProfileUpdateScreen", {
              mode: profileUpdateMode.email,
              userId: userId ? userId : "",
            })
          }
        >
          <Text style={commonStyle.textContainer}>
            {profileInfoStr.mailBut}
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
