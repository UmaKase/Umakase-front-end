import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import RandomResultScreen from "../../Screens/Home/Random/RandomResultScreen";
import RandomScreen from "../../Screens/Home/Random/RandomScreen";
import { RandomStackNavigationProps } from "../../Types/Navigations/HomeDrawer/RandomStack";

const RandomStackNavigation: React.FC = () => {
  const RoomStack = createNativeStackNavigator<RandomStackNavigationProps>();
  return (
    <RoomStack.Navigator
      initialRouteName="RandomScreen"
      screenOptions={{ headerShown: false }}
    >
      <RoomStack.Screen name="RandomScreen" component={RandomScreen} />
      <RoomStack.Screen
        name="RandomResultScreen"
        component={RandomResultScreen}
      />
    </RoomStack.Navigator>
  );
};

export default RandomStackNavigation;
