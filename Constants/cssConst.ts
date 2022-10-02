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
export const drawerColor = "#F4A58D";

//text color
export const lightTextColor = "#FFF";
export const darkTextColor = "#000";
export const errTextColor = "red";

export const inputIconSize = windowWidth * 0.07;
export const bottomIconSize = windowWidth * 0.07;
export const inputFontSize = windowWidth * 0.04;
