import {
  drawerColor,
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
import { UserAPI } from "../../Constants/backendAPI";
import { REFRESH_KEY } from "../../Constants/securestoreKey";
import * as SecureStore from "expo-secure-store";

interface ProfileInfoProps {}
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
const ProfileInfo: React.FC<ProfileInfoProps> = () => {
  const [userProfileContainer, setUseProfileContainer] =
    useState<UserProfileContainer>();
  //userProfileContainer = profileInfo.userProfileContainer;
  // //imgUrl = userProfileContainer.profile.
  // imgUrl == ""
  //   ? (imgUrl = require(defaultUserThumbnail))
  //   : URL.createObjectURL(imgUrl);
  imgUrl = require("../../image/umakase.png");
  useEffect(() => {
    console.log("useEffect");
    profileProcess((res: any) => {
      try {
        console.log(res.data.data.user);
        const resData = res.data.data.user as UserProfileContainer;
        console.log(resData);
        setUseProfileContainer(resData);
      } catch (e) {
        console.log(e);
      }
    });
  }, []);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowContainer}>
        <Image
          source={require("../../image/umakase.png")}
          style={styles.icon}
        />
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text>
            {userProfileContainer?.profile.firstname +
              " " +
              userProfileContainer?.profile.lastname}
          </Text>
          <Text>ID:******</Text>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <Text style={{ flex: 1, textAlign: "center" }}>メンバーシップ:</Text>
        <Text style={{ flex: 1, textAlign: "center" }}>無料会員</Text>
      </View>
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.button_disable}>
          <Text>プレミアムサービス登録</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.button_active}>
          <Text>メールアドレス設定</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const width = windowWidth * 0.35;
const height = (width * 4) / 3;
const borderRadius = windowWidth * 0.04;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "flex-start",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 5,
  },
  icon: {
    height: windowHeight * 0.11,
    width: windowWidth * 0.11,
    resizeMode: "contain",
    flex: 1,
  },
  button_active: {
    alignItems: "center",
    backgroundColor: drawerColor,
    width: windowWidth * 0.8,
    paddingTop: 5,
    paddingBottom: 5,
  },
  button_disable: {
    alignItems: "center",
    backgroundColor: "#b8b8b8",
    width: windowWidth * 0.8,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
export default ProfileInfo;
