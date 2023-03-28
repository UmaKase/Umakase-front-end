import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { HomeStackNavigationProps } from "../Types/Navigations/HomeStack";
import InitialStepsNavigation from "./InitialStepsNavigation";
import * as SecureStore from "expo-secure-store";
import { CONFIG_KEY } from "../Constants/securestoreKey";
import LoadingSpinner from "../Components/Auth/LoadingSpinner";
// import HomeTabNavigation from "./HomeTabNavigation";
import HomeDrawerNavigation from "./HomeDrawerNavigation";

const HomeStack = createNativeStackNavigator<HomeStackNavigationProps>();

const HomeStackNavigation: React.FC = ({}) => {
  const [config, setConfig] = useState<boolean>();
  const [fetching, setFetching] = useState<boolean>(true);
  const checkConfig = async () => {
    const isConfig = await SecureStore.getItemAsync(CONFIG_KEY);
    CONFIG_KEY;
    if (isConfig) {
      console.log("is config");
      return true;
    } else {
      console.log("not config");
      return false;
    }
  };

  useEffect(() => {
    checkConfig()
      .then((isConfig) => {
        if (isConfig) {
          setConfig(true);
        } else {
          setConfig(false);
        }
      })
      .then(() => {
        setFetching(false);
      });
  }, []);

  return fetching ? (
    <LoadingSpinner />
  ) : (
    <HomeStack.Navigator
      initialRouteName={
        config ? "HomeDrawerNavigation" : "InitialStepsNavigation"
      }
      screenOptions={{ headerShown: false }}
    >
      <HomeStack.Screen
        name="HomeDrawerNavigation"
        component={HomeDrawerNavigation}
      />
      <HomeStack.Screen
        name="InitialStepsNavigation"
        component={InitialStepsNavigation}
      />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigation;
