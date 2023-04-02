import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    tag.id === "" ? <View style={styles.tag}></View>
      : <TouchableOpacity
        style={[styles.tag, { backgroundColor: "#FFF", borderColor: tag.checked ? drawerColor : "#999", borderRadius: windowWidth * 0.05, borderWidth: 3 }]}
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowHeight * 0.03,
  },
  tagFont: {
    fontSize: windowWidth * 0.04,
  },
});
