import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import navigations
import AuthNavigation from "../navigations/AuthNavigation";
import HomeStackNavigation from "../navigations/HomeStackNavigation";
//import secureStore
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { AuthAPI } from "../Constants/backendAPI";
import {
  ACCESS_KEY,
  CONFIG_KEY,
  REFRESH_KEY,
} from "../Constants/securestoreKey";
import LoadingSpinner from "../Components/Auth/LoadingSpinner";
import { RootNavigationProps } from "../Types/Navigations/Root";
import customAxiosInstance from "../Utils/customAxiosInstance";

const RootRouter: React.FC = () => {
  const Stack = createNativeStackNavigator<RootNavigationProps>();
  //fetching data status
  const [fetching, setFetching] = useState<boolean>(true);
  // ANCHOR start token validation to do conditional navigation
  const [access, setAccess] = useState<boolean>();
  const [accessToken, setAccessToken] = useState<string>("");
  const tokenValidation = async () => {
    //use this while the account is not logout and you reinstall the DB
    // await SecureStore.deleteItemAsync(ACCESS_KEY);
    // await SecureStore.deleteItemAsync(CONFIG_KEY);
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    console.log("accessToken:", localAccessToken);
    const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!localAccessToken || !localRefreshToken) {
      return false;
    }
    const accessResult = await axios({
      method: "post",
      url: `${AuthAPI}/token/access`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
    });
    if (accessResult.data.ok) {
      setAccessToken(localAccessToken);
      console.log("success");
      return true;
    }
    const refreshResult = await axios({
      method: "post",
      url: `${AuthAPI}/token/refresh`,
      headers: { Authorization: `Bearer ${REFRESH_KEY}` },
    });
    if (refreshResult.status != 200) {
      console.log(refreshResult);
      return false;
    }
    await SecureStore.setItemAsync(ACCESS_KEY, refreshResult.data.accessToken);
    return true;
  };

  const authentication = async () => {
    customAxiosInstance({
      method: "post",
      url: `${AuthAPI}/token/access`,
    })
      .then((res) => {
        if (res.data.ok) {
          setAccess(true);
        } else {
          setAccess(false);
        }
      })
      .catch((e) => {
        console.log(e.response.data);
        setAccess(false);
      });
  };

  useEffect(() => {
    authentication();
  }, []);

  useEffect(() => {
    if (access) {
      setFetching(false);
    }
  }, [access]);

  return fetching ? (
    <LoadingSpinner />
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={access ? "HomeStackNavigation" : "AuthNavigation"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        <Stack.Screen
          name="HomeStackNavigation"
          component={HomeStackNavigation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootRouter;
