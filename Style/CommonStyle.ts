import { backgroundColor, drawerColor, errTextColor, lightTextColor, paddingLarge, paddingMedium, textLarge, textMedium, windowHeight, windowWidth } from "../Constants/cssConst";
import { StyleSheet } from "react-native";

export const commonStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  mainContainer: {
    flex: 1,
    paddingTop: paddingLarge,
    paddingBottom: paddingLarge,
    justifyContent: "flex-start",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: paddingMedium,
  },
  footer: {
    height: windowHeight * 0.08,
    width: windowWidth,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: windowHeight * 0.04,
  },
  button_active: {
    alignItems: "center",
    backgroundColor: drawerColor,
    flex: 1,
    paddingTop: paddingMedium,
    paddingBottom: paddingMedium,
    borderRadius: windowWidth * 0.025,
  },
  button_disable: {
    alignItems: "center",
    backgroundColor: "#b8b8b8",
    flex: 1,
    paddingTop: paddingMedium,
    paddingBottom: paddingMedium,
    borderRadius: windowWidth * 0.025,
  },
  textContainer: {
    textAlign: "center",
    color: lightTextColor,
    fontSize: textMedium,
  },
  titleText: {
    fontSize: textLarge,
  },
  subtitleText: {
    fontSize: textMedium,
    textAlign: "left",
    color: lightTextColor,
  },
  errText: {
    color: errTextColor,
  },
});