import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import RandomScreen from "../Screens/Home/RandomScreen";
import { HomeDrawerNavigationProps } from "../Types/Navigations/HomeDrawer";
import {
  backgroundColor,
  darkTextColor,
  drawerColor,
  lightTextColor,
} from "../Constants/cssConst";
import { ProfileStackScreen } from "./ProfileStackNavigation";

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
      <Drawer.Screen name="RandomScreen" component={RandomScreen} />
      <Drawer.Screen
        name="ProfileNavigation"
        component={ProfileStackScreen}
      ></Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigation;

const styles = StyleSheet.create({});
