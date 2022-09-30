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

const RootRouter: React.FC = () => {
  const Stack = createNativeStackNavigator<RootNavigationProps>();
  // fetching phase state
  const [fetching, setFetching] = useState<boolean>(true);
  // access return from token validation
  const [access, setAccess] = useState<boolean>();

  // token validation request
  const tokenValidation = async () => {
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
        console.log("token validation error:", e.response.data);
        setAccess(false);
      });
  };

  // initial token validation
  useEffect(() => {
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
