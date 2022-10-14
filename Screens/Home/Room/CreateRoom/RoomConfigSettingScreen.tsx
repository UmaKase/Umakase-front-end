import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../../../Types/Navigations/RoomStack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../../../Components/HomeDrawer/CustomHeader";
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../../../Constants/cssConst";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

type RoomConfigSettingScreeProps = NativeStackScreenProps<
  RoomStackNavigationProps,
  "RoomConfigSettingScreen"
>;
const RoomConfigSettingScreen: React.FC<RoomConfigSettingScreeProps> = ({
  navigation,
}) => {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [friends, setFriedns] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1]);

  useFocusEffect(() => {
    console.log("hi this is set room config screen.");

    return () => {
      console.log("see u next time :D");
    };
  });
  // useEffect(() => {
  //   console.log("hi this is set room config screen.");

  //   return () => {
  //     console.log("see u next time :D");
  //   };
  // }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.background}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.openDrawer)}
        ></CustomHeader>
        {/* title header  ================================================================ */}
        <View style={styles.title}>
          {/* prettier-ignore */}
          <Text style={{fontSize:windowWidth*0.08, color:"#FFF", fontWeight:"500"}}>タイトル</Text>
          <TouchableOpacity onPress={() => console.log("this is setting btn")}>
            {/* prettier-ignore */}
            <FontAwesome5 name="phabricator" size={windowWidth * 0.15} color="#FFF" />
          </TouchableOpacity>
        </View>
        {/* title input  ================================================================  */}
        <TextInput
          style={styles.titleInput}
          value={titleInput}
          onChangeText={(value) => setTitleInput(value)}
          selectionColor="#FFF"
          caretHidden={true}
        ></TextInput>
        {/* description  */}
        <View style={styles.title}>
          {/* prettier-ignore */}
          <Text style={{ fontSize: windowWidth * 0.08, color: "#FFF", fontWeight: "500"}}>
            説明
          </Text>
        </View>
        <TextInput
          style={styles.titleInput}
          value={descriptionInput}
          onChangeText={(value) => setDescriptionInput(value)}
          selectionColor="#FFF"
          caretHidden={true}
        ></TextInput>
        {/* member picking ======================================================== */}
        <View style={styles.title}>
          {/* prettier-ignore */}
          <Text style={{ fontSize: windowWidth * 0.08, color: "#FFF", fontWeight: "500"}}>参加者を選択</Text>
          <TouchableOpacity onPress={() => console.log("this is plus button!")}>
            {/* prettier-ignore */}
            <FontAwesome5 name="plus-circle" size={windowWidth * 0.12} color="#FFF" />
          </TouchableOpacity>
        </View>
        {/* member list */}
        <FlatList
          data={friends}
          keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1, backgroundColor: "#ECAC72" }}
          renderItem={() => {
            return (
              // prettier-ignore
              <View style={{height:windowHeight*0.05, width:windowWidth*0.9, borderRadius:windowWidth*0.03, backgroundColor:"#FFF", alignItems:"flex-start", justifyContent:"center", marginTop:windowHeight*0.02,}}>
                <Text>this is the sample</Text>
              </View>
            );
          }}
        />
        {/* footer ================================================================ */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <FontAwesome name="home" size={windowWidth * 0.12} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("next step!")}>
            <FontAwesome
              name="arrow-circle-right"
              size={windowWidth * 0.12}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: windowWidth * 0.03,
    marginTop: windowWidth * 0.01,
  },
});
