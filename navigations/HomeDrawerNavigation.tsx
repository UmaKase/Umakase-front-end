import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import RandomScreen from "../Screens/Home/RandomScreen";
import ProfileScreen from "../Screens/Home/ProfileScreen";
import { HomeDrawerNavigationProps } from "../types/Navigations/HomeDrawer";
import {
  backgroundColor,
  darkTextColor,
  drawerColor,
  lightTextColor,
} from "../Constants/cssConst";

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
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigation;

const styles = StyleSheet.create({});
