import { Alert, StyleSheet } from "react-native";
import React from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import RandomScreen from "../Screens/Home/RandomScreen";
import { HomeDrawerNavigationProps } from "../Types/Navigations/HomeDrawer";
import {
  drawerColor,
  lightTextColor,
  windowHeight,
  windowWidth,
} from "../Constants/cssConst";

import { ProfileStackScreen } from "./ProfileStackNavigation";
import RoomStackNavigation from "./DrawerNavigation/RoomStackNavigation";
import { Entypo } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const Drawer = createDrawerNavigator<HomeDrawerNavigationProps>();

const HomeDrawerNavigation: React.FC = () => {
  const navigation = useNavigation();
  const logoutFunction = () => {
    return Alert.alert("Logout", "Do you want to logout?", [
      {
        text: "Cancel",
        onPress: () => navigation.dispatch(DrawerActions.closeDrawer),
        style: "default",
      },
      {
        text: "Confirm",
        onPress: () => {
          console.log("loging out!");
          navigation.dispatch(DrawerActions.closeDrawer);
        },
        style: "destructive",
      },
    ]);
  };
  const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* devide line */}
        <DrawerItem
          label="_______________________________"
          onPress={() => {}}
          style={{
            height: 0,
            width: windowWidth * 0.63,
            borderWidth: 0.5,
            borderColor: "#FFF",
            marginVertical: windowHeight * 0.02,
          }}
        />
        {/* Logout Button */}
        <DrawerItem
          label="Logout"
          onPress={() => logoutFunction()}
          icon={() => (
            <Entypo name="log-out" size={windowWidth * 0.06} color="#FFF" />
          )}
          labelStyle={{
            color: "#FFF",
            fontSize: windowWidth * 0.04,
            fontWeight: "500",
          }}
        />
      </DrawerContentScrollView>
    );
  };
  return (
    <Drawer.Navigator
      initialRouteName="RandomScreen"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: drawerColor,
        },
        drawerActiveTintColor: drawerColor,
        drawerInactiveTintColor: lightTextColor,
        drawerActiveBackgroundColor: "#FFF",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="ProfileNavigation"
        component={ProfileStackScreen}
      ></Drawer.Screen>
      <Drawer.Screen name="RandomScreen" component={RandomScreen} />
      <Drawer.Screen name="Room" component={RoomStackNavigation} />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigation;

const styles = StyleSheet.create({});
