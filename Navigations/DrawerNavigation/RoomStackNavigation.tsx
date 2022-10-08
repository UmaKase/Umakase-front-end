import { Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../Types/Navigations/RoomStack";
import RoomListScreen from "../../Screens/Home/Room/RoomListScreen";

const RoomStack = createNativeStackNavigator<RoomStackNavigationProps>();

const RoomStackNavigation: React.FC = () => {
  return (
    <RoomStack.Navigator
      initialRouteName="RoomListScreen"
      screenOptions={{ headerShown: false }}
    >
      <RoomStack.Screen
        name="RoomListScreen"
        component={RoomListScreen}
      ></RoomStack.Screen>
    </RoomStack.Navigator>
  );
};

export default RoomStackNavigation;
