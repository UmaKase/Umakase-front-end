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
import { SettingStackNavigation } from "./SettingStackNavigation";
import { Entypo } from "@expo/vector-icons";
import {
  CommonActions,
  DrawerActions,
  useNavigation,
} from "@react-navigation/native";
import { DrawerLabel, logoutPopout } from "../Constants/homeConst";
import BookmarkedStackNavigation from "./DrawerNavigation/BookmarkedStackNavigation";
import { deleteItemAsync } from "expo-secure-store";
import { ACCESS_KEY, REFRESH_KEY } from "../Constants/securestoreKey";

const Drawer = createDrawerNavigator<HomeDrawerNavigationProps>();

const HomeDrawerNavigation: React.FC = () => {
  const navigation = useNavigation();
  const logoutFunction = () => {
    return Alert.alert(logoutPopout.title, logoutPopout.description, [
      {
        text: logoutPopout.cancel,
        onPress: () => {
          console.log("loging out!");
          navigation.dispatch(DrawerActions.closeDrawer);
        },
        style: "default",
      },
      {
        text: logoutPopout.confirm,
        onPress: async () => {
          await deleteItemAsync(ACCESS_KEY);
          await deleteItemAsync(REFRESH_KEY);
          navigation.dispatch(
            CommonActions.reset({
              routes: [{ name: "AuthNavigation" }],
            })
          );
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
          label=""
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
          label={DrawerLabel.logout}
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
        <Drawer.Screen
          name="ProfileNavigation"
          options={{ drawerLabel: DrawerLabel.profile }}
          component={ProfileStackScreen}
        ></Drawer.Screen>
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
      <Drawer.Screen
        name="RandomScreen"
        options={{ drawerLabel: DrawerLabel.random }}
        component={RandomScreen}
      />
      <Drawer.Screen
        name="BookmarkedStackNavigation"
        options={{ drawerLabel: DrawerLabel.bookmarked }}
        component={BookmarkedStackNavigation}
      />
      <Drawer.Screen
        name="Room"
        options={{ drawerLabel: DrawerLabel.room }}
        component={RoomStackNavigation}
      />
      <Drawer.Screen
        name="SettingNavigation"
        options={{ drawerLabel: DrawerLabel.setting }}
        component={SettingStackNavigation}
      />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigation;

const styles = StyleSheet.create({});
