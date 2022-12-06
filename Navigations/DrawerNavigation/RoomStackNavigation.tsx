import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../Types/Navigations/HomeDrawer/RoomStack";
import RoomListScreen from "../../Screens/Home/Room/RoomListScreen";
import RoomConfigSettingScreen from "../../Screens/Home/Room/CreateRoom/RoomConfigSettingScreen";
import RoomScreen from "../../Screens/Home/Room/CreateRoom/RoomScreen";

const RoomStack = createNativeStackNavigator<RoomStackNavigationProps>();

const RoomStackNavigation: React.FC = () => {
  return (
    <RoomStack.Navigator
      initialRouteName="RoomListScreen"
      screenOptions={{ headerShown: false }}
    >
      <RoomStack.Screen name="RoomListScreen" component={RoomListScreen} />
      {/* prettier-ignore */}
      <RoomStack.Screen name="RoomConfigSettingScreen" component={RoomConfigSettingScreen} />
      <RoomStack.Screen name="RoomScreen" component={RoomScreen} />
    </RoomStack.Navigator>
  );
};

export default RoomStackNavigation;
