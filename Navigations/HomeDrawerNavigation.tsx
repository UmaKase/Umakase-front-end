import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator, DrawerContent } from "@react-navigation/drawer";
import RandomScreen from "../Screens/Home/RandomScreen";
import { HomeDrawerNavigationProps } from "../Types/Navigations/HomeDrawer";
import {
  darkTextColor,
  drawerColor,
  lightTextColor,
} from "../Constants/cssConst";

import { ProfileStackScreen } from "./ProfileStackNavigation";
import RoomStackNavigation from "./DrawerNavigation/RoomStackNavigation";

const Drawer = createDrawerNavigator<HomeDrawerNavigationProps>();

const HomeDrawerNavigation: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="RandomScreen"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: drawerColor,
        },
        drawerActiveTintColor: darkTextColor,
        drawerInactiveTintColor: lightTextColor,
      }}
    >
      <Drawer.Screen
        name="RandomScreen"
        component={RandomScreen}
        options={{
          drawerContentContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: "#FFF",
          },
        }}
      />

      <Drawer.Screen name="Room" component={RoomStackNavigation} />

      <Drawer.Screen name="ProfileNavigation" component={ProfileStackScreen} />
      {/* <DrawerContent navigation={}></DrawerContent> */}
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigation;

const styles = StyleSheet.create({});
