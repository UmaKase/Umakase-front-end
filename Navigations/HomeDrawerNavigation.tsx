import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  createDrawerNavigator,
  DrawerContent,
  DrawerItem,
} from "@react-navigation/drawer";
import RandomScreen from "../Screens/Home/RandomScreen";
import { HomeDrawerNavigationProps } from "../Types/Navigations/HomeDrawer";
import {
  darkTextColor,
  drawerColor,
  lightTextColor,
  windowHeight,
  windowWidth,
} from "../Constants/cssConst";

import { ProfileStackScreen } from "./ProfileStackNavigation";
import RoomStackNavigation from "./DrawerNavigation/RoomStackNavigation";
import { MaterialIcons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator<HomeDrawerNavigationProps>();

const HomeDrawerNavigation: React.FC = () => {
  const logoutFunction = () => {};
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
        name="ProfileNavigation"
        component={ProfileStackScreen}
      ></Drawer.Screen>
      <Drawer.Screen name="RandomScreen" component={RandomScreen} />

      <Drawer.Screen
        name="Room"
        component={RoomStackNavigation}
        options={{
          drawerItemStyle: {
            borderBottomWidth: 1,
            borderBottomColor: "#FFF",
          },
        }}
      />
      {/* <DrawerItem
        label="logout"
        onPress={() => logoutFunction()}
        icon={() => (
          <MaterialIcons name="logout" size={windowWidth * 0.05} color="#FFF" />
        )}
      /> */}

      {/* <DrawerContent navigation={}></DrawerContent> */}
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigation;

const styles = StyleSheet.create({});
