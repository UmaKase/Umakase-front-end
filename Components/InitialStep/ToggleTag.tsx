import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

import {
  drawerColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { TagCheck } from "../../Types/InitialSteps";

type Props = {
  tag: TagCheck;
  onPressHandler: () => void;
};

const ToggleTag: React.FC<Props> = ({ tag, onPressHandler }) => {
  return (
    <TouchableOpacity
      style={[styles.tag, { borderColor: tag.checked ? drawerColor : "#FFF" }]}
      onPress={() => onPressHandler()}
    >
      <Text style={[styles.tagFont, { color: tag.checked ? drawerColor : "#000" }]}>
        {tag.name}
      </Text>
    </TouchableOpacity>
  );
};

export default ToggleTag;

const styles = StyleSheet.create({
  tag: {
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    borderRadius: windowWidth * 0.05,
    borderWidth: 3,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowHeight * 0.03,
  },
  tagFont: {
    fontSize: windowWidth * 0.04,
  },
});
