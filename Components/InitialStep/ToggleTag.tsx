import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tag } from "../../types/InitialSteps/Tag";
import {
  drawerColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  tag: Tag;
  check: boolean;
  onPressHandler: () => void;
};

const ToggleTag: React.FC<Props> = ({ tag, check, onPressHandler }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tagContainer,
        { borderColor: check ? drawerColor : "#FFF" },
      ]}
      onPress={() => onPressHandler()}
    >
      <Text style={[styles.tagFont, { color: check ? drawerColor : "#000" }]}>
        {tag.name}
      </Text>
    </TouchableOpacity>
  );
};

export default ToggleTag;

const styles = StyleSheet.create({
  tagContainer: {
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    borderRadius: windowWidth * 0.05,
    borderWidth: 3,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: windowWidth * 0.05,
    marginTop: windowHeight * 0.03,
  },
  tagFont: {
    fontSize: windowWidth * 0.035,
  },
});
