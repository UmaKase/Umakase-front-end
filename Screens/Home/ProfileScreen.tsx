import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RoomAPI } from "../../Constants/backendAPI";
import { DrawerActions } from "@react-navigation/native";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import ProfileInfo from "../../Components/Home/ProfileInfo";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../../Types/Home/Profile/ProfileStackProps";
import { commonStyle } from "../../Style/CommonStyle";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { ProfileContext } from "../../Context/ProfileContext";
import { TipsContext } from "../../Context/TipsContext";
import { functionCategory } from "../../Constants/homeConst";
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
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [userId, setUserId] = useState<string>();
  const [defaultRoomId, setDefaultRoomId] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [surName, setSurName] = useState<string>("");
  //get user id
  useEffect(() => {
    getRoomIdCall(
      (getRooms: any) => {
        setDefaultRoomId(getRooms.data.data.rooms[0].room.id);
      },
      () => {}
    );
    console.log(`user:${userId},room${defaultRoomId}`);
  }, [setUserId]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={commonStyle.safeArea}>
        <TipsContext.Provider
          value={{ currentCategory: functionCategory.profile }}
        >
          <CustomHeader
            toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          ></CustomHeader>
        </TipsContext.Provider>
        <ProfileContext.Provider
          value={{
            lastName: lastName,
            firstName: surName,
            setLastName: setLastName,
            setFirstName: setSurName,
          }}
        >
          <ProfileInfo
            userId={userId}
            setUserId={setUserId}
            navigation={navigation}
          />
        </ProfileContext.Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default ProfileScreen;
