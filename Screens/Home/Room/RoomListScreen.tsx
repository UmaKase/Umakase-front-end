import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { backgroundColor } from "../../../Constants/cssConst";
import CustomHeader from "../../../Components/HomeDrawer/CustomHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../../Types/Navigations/RoomStack";
import { DrawerActions } from "@react-navigation/native";

type Props = NativeStackScreenProps<RoomStackNavigationProps, "RoomListScreen">;

const RoomListScreen: React.FC<Props> = ({ navigation, route }) => {
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
