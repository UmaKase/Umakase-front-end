import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../Types/Navigations/RoomStack";
import RoomListScreen from "../../Screens/Home/Room/RoomListScreen";
import RoomConfigSettingScreen from "../../Screens/Home/Room/CreateRoom/RoomConfigSettingScreen";

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
    </RoomStack.Navigator>
  );
};

export default RoomStackNavigation;
