import React from "react";
import { NavigationContainerRef } from "@react-navigation/native";
// navigation props
import { HomeStackNavigationProps } from "../Types/Navigations/HomeStack";
import { HomeDrawerNavigationProps } from "../Types/Navigations/HomeDrawer";
import { InitialStepsProps } from "../Types/Navigations/InitialSteps";
import { AuthNavigationProps } from "../Types/Navigations/Auth";
import { BookmarkedStackProps } from "../Types/Navigations/HomeDrawer/BookmarkedStack";
import { RandomStackNavigationProps } from "../Types/Navigations/HomeDrawer/RandomStack";
import { RoomStackNavigationProps } from "../Types/Navigations/HomeDrawer/RoomStack";
import { ProfileStackProps } from "../Types/Home/Profile/ProfileStackProps";
import { SettingStackProps } from "../Types/Home/Setting/SettingStackProps";

type NavigationPropsType = HomeStackNavigationProps
  | HomeDrawerNavigationProps
  | InitialStepsProps
  | AuthNavigationProps
  | BookmarkedStackProps
  | RandomStackNavigationProps
  | RoomStackNavigationProps
  | ProfileStackProps
  | SettingStackProps;

const NavigationProps = {
  "HomeStack": {} as HomeStackNavigationProps,
  // under home stack
  "HomeDrawer": {} as HomeDrawerNavigationProps,
  "InitialSteps": {} as InitialStepsProps,
  "Auth": {} as AuthNavigationProps,
  // under home drawer
  "BookMark": {} as BookmarkedStackProps,
  "Random": {} as RandomStackNavigationProps,
  "Room": {} as RoomStackNavigationProps,
  "Profile": {} as ProfileStackProps,
  "Setting": {} as SettingStackProps
}

export const rootNavigationRef = React.createRef<NavigationContainerRef<NavigationPropsType>>();

export const globalNavigationService = <T extends keyof typeof NavigationProps>(navigationName: T) => {
  type CurrentNavigation = typeof NavigationProps[typeof navigationName];
  if(rootNavigationRef.current) {
    return rootNavigationRef.current as NavigationContainerRef<CurrentNavigation>;
  }else{
    console.log("globalNavigationService: rootNavigationRef.current is null");
    return
  }
}