import {
  paddingLarge,
  textLarge,
  textMedium,
  windowWidth,
} from "../../Constants/cssConst";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { AuthAPI, UserAPI } from "../../Constants/backendAPI";
import {
  REFRESH_KEY,
  CURRENTROOM_NAME_KEY,
} from "../../Constants/securestoreKey";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../../Types/Home/Profile/ProfileStackProps";
import {
  profileInfoNum,
  profileInfoStr,
  profileMembership,
  profileUpdateMode,
  profileUpdateTitle,
} from "../../Constants/ProfileConst";
import { AxiosResponse } from "axios";
import { UserProfileContainer } from "../../Types/Home/Profile/ProfileScreen";
import { FontAwesome } from "@expo/vector-icons";
import { commonStyle } from "../../Style/CommonStyle";
import LoadingSpinner from "../../Components/Auth/LoadingSpinner";
import { ProfileContext } from "../../Context/ProfileContext";
import { useFocusEffect } from "@react-navigation/core";

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
  const tempRoomName = await SecureStore.getItemAsync(CURRENTROOM_NAME_KEY);
  setter(tempRoomName != null ? tempRoomName : profileInfoStr.notSet);
};
const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userId,
  setUserId,
  navigation,
}) => {
  //state variable defined
  const [userProfileContainer, setUseProfileContainer] =
    useState<UserProfileContainer>();
  const [userName, setUserName] = useState<string>("");
  const [membership, setMembership] = useState<number>(
    profileInfoNum.membershipFree
  );
  const [membershipText, setMembershipText] = useState<string>("");
  const [currentRoomName, setCurrentRoomName] = useState<string>(
    profileInfoStr.notSet
  );
  const [fetching, setFetching] = useState<boolean>(true);

  //current
  const { lastName, firstName, setLastName, setFirstName } =
    useContext(ProfileContext);
  getCurrentRoomName(setCurrentRoomName);

  const displayName = () => {
    if (membership == profileInfoNum.memberUnregister)
      return (
        <Text style={[commonStyle.textContainer, { fontSize: textLarge }]}>
          {`${profileInfoStr.unregisterUserName}`}
        </Text>
      );
    else if (lastName == "" && firstName == "")
      return (
        <Text style={[commonStyle.textContainer, { fontSize: textLarge }]}>
          {`${userName}`}
        </Text>
      );
    else
      return (
        <Text style={[commonStyle.textContainer, { fontSize: textLarge }]}>
          {`${lastName} ${firstName}`}
        </Text>
      );
  };
  const profileSuccessHandler = (res: AxiosResponse<any, any>) => {
    try {
      //convert response to user profile type
      const resData = res.data.data.user as UserProfileContainer;
      //set user id in the parent screen
      setUserId(resData.profile.userId);
      setUserName(resData.profile.username);
      if (resData.email != null && resData.email != "") {
        setMembership(profileInfoNum.membershipFree);
        setMembershipText(profileMembership[profileInfoNum.membershipFree]);
      } else {
        setMembership(profileInfoNum.memberUnregister);
        setMembershipText(profileMembership[profileInfoNum.memberUnregister]);
      }
      //set user profile to state
      setUseProfileContainer(resData);
      if (setLastName != undefined && resData.profile.lastname != undefined) {
        setLastName(resData.profile.lastname);
      }
      if (setFirstName != undefined && resData.profile.firstname != undefined) {
        setFirstName(resData.profile.firstname);
      }
      setFetching(false);
    } catch (e) {
      console.log(e);
      const resData = {
        profile: {
          id: "",
          username: "",
          firstname: "",
          lastname: "",
          userId: "",
        },
      } as UserProfileContainer;
      setUseProfileContainer(resData);
      setFetching(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      profileProcess(profileSuccessHandler);
    }, [])
  );
  return fetching ? (
    <LoadingSpinner />
  ) : (
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
          {displayName()}
          {membership == profileInfoNum.memberUnregister ? (
            <Text
              style={[commonStyle.textContainer, { fontSize: textLarge }]}
            >{`${profileInfoStr.IdHint}${profileInfoStr.IdMask}`}</Text>
          ) : (
            <Text
              style={[commonStyle.textContainer, { fontSize: textLarge }]}
            >{`${profileInfoStr.IdHint}${userName}`}</Text>
          )}
        </View>
      </View>
      {/* membership display*/}
      <View style={[commonStyle.rowContainer, { paddingTop: paddingLarge }]}>
        <Text style={[commonStyle.textContainer, styles.membership]}>
          {profileInfoStr.membershipHint}
        </Text>
        <Text style={[commonStyle.textContainer, styles.membership]}>
          {membershipText}
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

      {membership == profileInfoNum.memberUnregister ? (
        <View style={[commonStyle.rowContainer, { paddingTop: paddingLarge }]}>
          <TouchableOpacity
            style={commonStyle.button_active}
            onPress={async () => navigation.navigate("RegisterScreen")}
          >
            <Text style={commonStyle.textContainer}>
              {profileInfoStr.mergedUserRegisterBut}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[commonStyle.rowContainer, { paddingTop: paddingLarge }]}>
          <TouchableOpacity
            style={commonStyle.button_disable}
            onPress={() => {}}
            disabled
          >
            <Text style={commonStyle.textContainer}>
              {profileInfoStr.premiumRegisterBut}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={commonStyle.rowContainer}>
        <TouchableOpacity
          style={commonStyle.button_active}
          onPress={() =>
            navigation.navigate("ProfileUpdateScreen", {
              mode: profileUpdateMode.personalInfo,
              userId: userId ? userId : "",
              userName: userName,
              lastName: lastName,
              firstName: firstName,
              setLastName: setLastName,
              setFirstName: setFirstName,
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
              userName: userName,
              userId: userId ? userId : "",
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
