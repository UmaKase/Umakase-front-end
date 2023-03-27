import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import navigations
import AuthNavigation from "../Navigations/AuthNavigation";
import HomeStackNavigation from "../Navigations/HomeStackNavigation";
//import secureStore
import { AuthAPI } from "../Constants/backendAPI";
import LoadingSpinner from "../Components/Auth/LoadingSpinner";
import { RootNavigationProps } from "../Types/Navigations/Root";
import customAxiosInstance from "../Utils/customAxiosInstance";
import { deleteItemAsync, getItemAsync } from "expo-secure-store";
import { ACCESS_KEY, CONFIG_KEY, INITIAL_STAGE_FOOD, INITIAL_STAGE_TAG, REFRESH_KEY, TEMPUSERID_KEY, TEMPUSERPASS_KEY } from "../Constants/securestoreKey";
import {rootNavigationRef} from '../Ref'

const RootRouter: React.FC = () => {
  const Stack = createNativeStackNavigator<RootNavigationProps>();
  // fetching phase state
  const [fetching, setFetching] = useState<boolean>(true);
  // access return from token validation
  const [access, setAccess] = useState<boolean>();

  // token validation request
  const tokenValidation = async () => {
    const config = await getItemAsync(CONFIG_KEY);
    if (config) {
      await customAxiosInstance({
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
          console.log("token validation error:", e.response.data.message);
          setAccess(false);
        });
    } else {
      setAccess(true);
    }
  };

  const testFunction = () => {
    deleteItemAsync(CONFIG_KEY);
    deleteItemAsync(ACCESS_KEY);
    deleteItemAsync(REFRESH_KEY);
    deleteItemAsync(TEMPUSERID_KEY);
    deleteItemAsync(TEMPUSERPASS_KEY);
    deleteItemAsync(INITIAL_STAGE_TAG);
    deleteItemAsync(INITIAL_STAGE_FOOD);
  };

  // initial token validation
  useEffect(() => {
    // testFunction();
    if (access === undefined) {
      tokenValidation();
    }
  }, []);

  // after setAccess state end the fetching phase
  useEffect(() => {
    if (access !== undefined) {
      setFetching(false);
    }
  }, [access]);

  return fetching ? (
    <LoadingSpinner />
  ) : (
    <NavigationContainer ref={rootNavigationRef}>
      <Stack.Navigator initialRouteName={access ? "HomeStackNavigation" : "AuthNavigation"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        <Stack.Screen name="HomeStackNavigation" component={HomeStackNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootRouter;
