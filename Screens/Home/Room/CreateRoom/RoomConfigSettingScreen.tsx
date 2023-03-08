import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../../../Types/Navigations/HomeDrawer/RoomStack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../../../Components/HomeDrawer/CustomHeader";
import { DrawerActions } from "@react-navigation/native";
import { backgroundColor, paddingLarge, windowHeight, windowWidth } from "../../../../Constants/cssConst";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import SearchBar from "../../../../Components/InitialStep/SearchBar";
import _ from "lodash";
import authAxiosInstance from "../../../../Utils/authAxiosInstance";
import { RoomAPI } from "../../../../Constants/backendAPI";
import UserList from "../../../../Components/Home/UserList";
import { UserContext } from "../../../../Context/UserContext";
import { profileScreenStr } from "../../../../Constants/ProfileConst";
import { User } from "../../../../Types/types";
import CenterActivityIndicator from "../../../../Components/Universal/CenterActivityIndicator";

type RoomConfigSettingScreeProps = NativeStackScreenProps<RoomStackNavigationProps, "RoomConfigSettingScreen">;
const RoomConfigSettingScreen: React.FC<RoomConfigSettingScreeProps> = ({ navigation }) => {
  const [fetching, setFetching] = useState(true);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [friends, setFriedns] = useState<User[]>([]);
  const [roomieNames, setRoomieNames] = useState<string[]>([]);

  // create room function
  const createRoom = async () => {
    await authAxiosInstance({
      method: "post",
      url: `${RoomAPI}/new`,
      data: {
        name: titleInput,
        roomieNames: [],
      },
    })
      .then((res) => {
        if (res.data) {
          navigation.pop();
        }
      })
      .catch((e) => {
        console.log(JSON.stringify(e.response));
        return Alert.alert("Create room failed.", `${e.response.error}`);
      });
  };

  // search mode
  // const [searchMode, setSearchMode] = useState(false);
  // const [searchInput, setSearchInput] = useState("");
  // const searchOn = () => {
  //   setSearchMode(true);
  // };
  // const leaveSearchMode = () => {
  //   setSearchMode(false);
  // };
  // const searchFriend = useCallback(
  //   _.debounce((input: string) => {
  //     console.log(input);
  //   }, 500),
  //   []
  // );

  useEffect(() => {
    console.log("hi this is set room config screen.");
    // setFriedns(fakeUserData); => get friend api needed
    setFetching(false);
    return () => {
      console.log("see u next time :D");
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.background}>
        <CustomHeader toggleMenu={() => navigation.dispatch(DrawerActions.openDrawer)}></CustomHeader>
        {/* title header  ================================================================ */}
        <View style={styles.title}>
          {/* prettier-ignore */}
          <Text style={{fontSize:windowWidth*0.08, color:"#FFF", fontWeight:"500"}}>タイトル</Text>
          <TouchableOpacity
            onPress={() => {
              console.log("this is setting btn");
            }}
          >
            {/* prettier-ignore */}
            <FontAwesome5
            name="trash"
            size={windowWidth * 0.1}
            color="#FFF"
          />
          </TouchableOpacity>
        </View>
        {/* title input  ================================================================  */}
        <TextInput style={styles.titleInput} value={titleInput} onChangeText={(value) => setTitleInput(value)} selectionColor="#FFF" caretHidden={true}></TextInput>
        {/* description  */}
        <View style={styles.title}>
          <Text
            style={{
              fontSize: windowWidth * 0.08,
              color: "#FFF",
              fontWeight: "500",
            }}
          >
            説明
          </Text>
        </View>
        <TextInput style={styles.titleInput} value={descriptionInput} onChangeText={(value) => setDescriptionInput(value)} selectionColor="#FFF" caretHidden={true}></TextInput>
        {/* member picking ======================================================== */}
        {/* <View style={styles.title}>
          <Text
            style={{
              fontSize: windowWidth * 0.08,
              color: "#FFF",
              fontWeight: "500",
            }}
          >
            参加者を選択
          </Text>
          <TouchableOpacity
            onPress={() => {
              searchOn();
              console.log("this is plus button!");
            }}
          >
            <FontAwesome5
              name="plus-circle"
              size={windowWidth * 0.12}
              color="#FFF"
            />
          </TouchableOpacity>
        </View> */}
        {/* member list =================*/}
        <View style={{ flex: 1 }}>
          {fetching ? (
            <CenterActivityIndicator size="large" color="#FFF" />
          ) : (
            <UserContext.Provider
              value={{
                users: friends,
                headerTitle: profileScreenStr.userListHeaderText,
                handleRemove: (user: User) => {
                  console.log(user.id);
                },
                handleSelect: () => {},
              }}
            >
              <UserList />
            </UserContext.Provider>
          )}
        </View>
        {/* footer ================================================================ */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <FontAwesome name="home" size={windowWidth * 0.12} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => createRoom()}>
            <FontAwesome name="arrow-circle-right" size={windowWidth * 0.12} color="#FFF" />
          </TouchableOpacity>
        </View>
        {/* search modal =================================================== */}
        {/* <Modal
          isVisible={searchMode}
          onBackdropPress={() => leaveSearchMode()}
          style={{ margin: 0, justifyContent: "flex-end" }}
        >
          <View style={styles.modal}>
            <SearchBar
              input={searchInput}
              setInput={setSearchInput}
              placeholderText="Enter user name"
              searchFunction={(input: string) => searchFriend(input)}
            />
          </View>
        </Modal> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RoomConfigSettingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: "center",
  },
  // title part
  title: {
    height: windowHeight * 0.077,
    width: windowWidth * 0.9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: windowWidth * 0.01,
    marginVertical: windowWidth * 0.03,
  },
  titleInput: {
    height: windowHeight * 0.077,
    width: windowWidth * 0.9,
    paddingHorizontal: windowWidth * 0.02,
    fontSize: windowWidth * 0.08,
    textAlign: "center",
    backgroundColor: "#ECAC72",
    color: "#FFF",
  },

  // desscription part
  descriptionInpit: {
    height: windowHeight * 0.13,
    width: windowWidth * 0.9,
    paddingHorizontal: windowWidth * 0.02,
    fontSize: windowWidth * 0.08,
    textAlign: "center",
    backgroundColor: "#ECAC72",
    color: "#FFF",
  },

  // footer
  footer: {
    height: windowHeight * 0.07,
    width: windowWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: paddingLarge,
    marginTop: windowWidth * 0.01,
  },
  // modal
  modal: {
    flex: 0.75,
    backgroundColor: "#FFF",
    borderTopLeftRadius: windowWidth * 0.05,
    borderTopRightRadius: windowWidth * 0.05,
  },
});
