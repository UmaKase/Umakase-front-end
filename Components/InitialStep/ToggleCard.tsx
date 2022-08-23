import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Tag } from "../../types/InitialSteps/Tag";
import {
  backgroundColor,
  drawerColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";

interface ToggleCardProps {
  tag: Tag;
  checked: boolean;
  onPressHandler: () => void;
}

const ToggleCard: React.FC<ToggleCardProps> = ({
  tag,
  checked,
  onPressHandler,
}) => {
  return (
    <TouchableOpacity
      onPress={onPressHandler}
      style={[
        styles.cardBackground,
        { backgroundColor: checked ? "#FFF" : backgroundColor },
      ]}
    >
      <View style={styles.imgContainer}>{/* <Image ></Image> */}</View>
      <View style={styles.nameContainer}>
        <Text
          style={[styles.name, { color: checked ? backgroundColor : "#FFF" }]}
        >
          {tag.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ToggleCard;

const width = windowWidth * 0.35;
const height = (width * 4) / 3;
const borderRadius = windowWidth * 0.04;

const styles = StyleSheet.create({
  cardBackground: {
    width: width,
    height: height,
    borderRadius: borderRadius,
    marginLeft: windowWidth * 0.1,
    marginVertical: windowHeight * 0.01,
  },
  imgContainer: {
    width: width,
    height: (height * 3) / 4,
    resizeMode: "contain",
    borderRadius: borderRadius,

    backgroundColor: drawerColor,
  },
  nameContainer: {
    width: width,
    height: height / 4,
    borderRadius: borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: windowWidth * 0.04,
    flexWrap: "wrap",
    // flexShrink: 1,
  },
});
