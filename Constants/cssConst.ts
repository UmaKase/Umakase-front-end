import { Dimensions } from "react-native";
//getting the window width and height
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

//Radius
export const cornerRadius = windowWidth * 0.23;
//Colors
//origin bg_DarkColor = "#171535";

//background color
export const backgroundColor = "#FAC595";
export const darkerBackgroundColor = "#ECAC72";
export const drawerColor = "#F4A58D";

//text color
export const lightTextColor = "#FFF";
export const darkTextColor = "#000";
export const errTextColor = "red";

export const inputIconSize = windowWidth * 0.07;
export const bottomIconSize = windowWidth * 0.07;
export const inputFontSize = windowWidth * 0.04;

//fontSize
export const textExtraLarge = windowWidth * 0.11;
export const textLarge = windowWidth * 0.07;
export const textMedium = windowWidth * 0.045;
export const textSmall = windowWidth * 0.02;

//padding
export const paddingLarge = windowWidth * 0.05;
export const paddingMedium = windowWidth * 0.02;
export const paddingSmall = windowWidth * 0.005;
