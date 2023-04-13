import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  lightTextColor,
  textMedium,
  windowHeight,
  windowWidth,
} from "../../../Constants/cssConst";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  /**
   * state to define is add food mode or trash food mode
   */
  favMode: boolean;
  /**
   * setState of favMode function
   */
  setFavMode: (value: React.SetStateAction<boolean>) => void;
  /**
   * handle add button function
   */
  editButtonPress: () => void;
};
const ControlBar: React.FC<Props> = ({
  favMode,
  setFavMode,
  editButtonPress,
}) => {
  const iconSize = windowWidth * 0.08;
  return (
    <View style={styles.container}>
      <View style={[styles.subContainer, { justifyContent: "flex-start" }]}>
        <TouchableOpacity onPress={() => setFavMode(!favMode)}>
          {favMode ? (
            <MaterialCommunityIcons
              name="checkbox-marked-outline"
              size={iconSize}
              color={lightTextColor}
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank"
              size={iconSize}
              color={lightTextColor}
            />
          )}
        </TouchableOpacity>
        <Text style={{ fontSize: textMedium, color: lightTextColor }}>
          お気入り
        </Text>
      </View>
      <View style={[styles.subContainer, { justifyContent: "flex-end" }]}>
        <TouchableOpacity
          onPress={editButtonPress}
          style={{ marginRight: windowWidth * 0.01 }}
        >
          <FontAwesome name="edit" size={iconSize} color={lightTextColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ControlBar;

const styles = StyleSheet.create({
  container: {
    width: windowWidth * 0.88,
    height: windowHeight * 0.06,
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
  },
  subContainer: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
  },
});
