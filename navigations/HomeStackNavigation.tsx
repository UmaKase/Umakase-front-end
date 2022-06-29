import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { HomeStackNavigationProps } from "../Types/Navigations/HomeStack";
import InitialStepsNavigation from "./InitialStepsNavigation";
import * as SecureStore from "expo-secure-store";
import { CONFIG_KEY } from "../Constants/securestoreKey";
import HomeTabNavigation from "./HomeTabNavigation";
import LoadingSpinner from "../Components/Auth/LoadingSpinner";

const HomeStack = createNativeStackNavigator<HomeStackNavigationProps>();

const HomeStackNavigation: React.FC = ({}) => {
  const [config, setConfig] = useState<boolean>();
  const [fetching, setFetching] = useState<boolean>(true);
  const checkConfig = async () => {
    const isConfig = await SecureStore.getItemAsync(CONFIG_KEY);
    console.log(isConfig);
    if (isConfig) {
      console.log("is config");
      setConfig(true);
    } else {
      console.log("not config");
      setConfig(false);
    }
  };

  useEffect(() => {
    checkConfig();
    setFetching(false);
    console.log("this is config:", config);
  }, []);

  return fetching ? (
    <LoadingSpinner />
  ) : (
    <HomeStack.Navigator
      initialRouteName={config ? "HomeTabNavigation" : "InitialStepsNavigation"}
      screenOptions={{ headerShown: false }}
    >
      <HomeStack.Screen
        name="HomeTabNavigation"
        component={HomeTabNavigation}
      />
      <HomeStack.Screen
        name="InitialStepsNavigation"
        component={InitialStepsNavigation}
      />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigation;
