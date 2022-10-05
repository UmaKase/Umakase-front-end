import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { backgroundColor } from "../../../Constants/cssConst";
import CustomHeader from "../../../Components/HomeDrawer/CustomHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../../Types/Navigations/RoomStack";
import { DrawerActions } from "@react-navigation/native";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
import { RoomAPI } from "../../../Constants/backendAPI";

type Props = NativeStackScreenProps<RoomStackNavigationProps, "RoomListScreen">;

const RoomListScreen: React.FC<Props> = ({ navigation, route }) => {
  useEffect(() => {
    customAxiosInstance({
      method: "get",
      url: `${RoomAPI}/info/:id`,
    })
      .then((res) => {
        console.log("response status:", res.status);
        console.log(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.background}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.openDrawer)}
        ></CustomHeader>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RoomListScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
});
