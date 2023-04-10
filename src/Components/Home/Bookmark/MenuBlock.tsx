import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  windowHeight,
  windowWidth,
  darkerBackgroundColor,
  lightTextColor,
} from "../../../Constants/cssConst";

type Props = {
  onPressHandler: () => void;
  Icon: React.ReactNode;
  title: string;
};
const MenuBlock: React.FC<Props> = ({ onPressHandler, Icon, title }) => {
  return (
    <TouchableOpacity onPress={onPressHandler} style={styles.blockContainer}>
      {Icon}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MenuBlock;

const styles = StyleSheet.create({
  blockContainer: {
    height: windowHeight * 0.18,
    width: windowWidth * 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowWidth * 0.03,
    backgroundColor: darkerBackgroundColor,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: windowHeight * 0.03,
  },
  title: {
    fontSize: windowHeight * 0.03,
    color: lightTextColor,
    fontWeight: "600",
    marginTop: windowHeight * 0.01,
  },
});
