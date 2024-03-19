import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  lightTextColor,
  textMedium,
  windowHeight,
  windowWidth,
} from "../../../Constants/cssConst";
import { FontAwesome5, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

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
   * select all food flag
  */
  selectAll: boolean;
  /**
   * setState of selectAll function
   */
  handleAdd: () => void;
  /**
   * handle trash button function
   */
  editButtonPress: () => void;
};
const ControlBar: React.FC<Props> = ({
  favMode,
  setFavMode,
  handleAdd,
  handleTrash,
  toggleFlag,
}) => {
  const iconSize = windowWidth * 0.08;
  return (
    <View style={styles.container}>
      <View style={[styles.subContainer, { justifyContent: "flex-start" }]}>
        {/* favorite checkbox */}
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
        {/* select all checkbox */}
        <TouchableOpacity onPress={() => { setSelectAll(prev => !prev) }}>
          {selectAll ? (
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
        {selectAll ? null : <Text style={{ fontSize: textMedium, color: lightTextColor }}>
          全選択
        </Text>}
      </View>
      <View style={[styles.subContainer, { justifyContent: "flex-end" }]}>
        <TouchableOpacity
          onPress={() => handleAdd()}
          disabled={!toggleFlag}
          style={{ marginRight: windowWidth * 0.03 }}
        >
          <FontAwesome5
            name="plus-circle"
            size={iconSize * 0.9}
            color={toggleFlag ? lightTextColor : "#D9D9D9"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTrash()} disabled={toggleFlag}>
          <FontAwesome5
            name="trash"
            size={iconSize * 0.9}
            color={toggleFlag ? "#D9D9D9" : lightTextColor}
          />
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
