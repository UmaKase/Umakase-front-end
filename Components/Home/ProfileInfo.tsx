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

interface ProfileInfoProps {
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
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
const ProfileInfo: React.FC<ProfileInfoProps> = ({ setUserId }) => {
  const [userProfileContainer, setUseProfileContainer] =
    useState<UserProfileContainer>();
  imgUrl = require("../../image/umakase.png");
  //onload
  useEffect(() => {
    profileProcess((res: any) => {
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
          <Text>{userProfileContainer?.profile.username}</Text>
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
