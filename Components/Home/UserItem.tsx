import { FontAwesome } from "@expo/vector-icons";
import {
  backgroundColor,
  lightTextColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import React, { FunctionComponent, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface UserItemProps {
  item: any;
}

const UserItem: FunctionComponent<UserItemProps> = (item: any) => {
  const [selected, setSelected] = useState<Boolean>(false);
  return (
    <TouchableOpacity
      style={styles.userItemTouchableOpacity}
      onPress={() => {
        setSelected(!selected);
      }}
    >
      <View
        style={[
          styles.userItemView,
          selected ? styles.selected : styles.deselected,
        ]}
      >
        <View style={styles.userItemInfoContainer}>
          <Image
            source={require("../../Image/Umakase.png")}
            style={styles.userItemIcon}
          />
          <Text style={[selected ? styles.selected : styles.deselected]}>
            {item.item.item.title}
          </Text>
        </View>
        <View
          style={[
            styles.userItemButtonContainer,
            selected ? styles.selected : styles.deselected,
          ]}
        >
          <TouchableOpacity onPress={() => {}}>
            <FontAwesome
              name="user-times"
              size={windowWidth * 0.05}
              color={selected ? backgroundColor : lightTextColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  userItemView: {
    flexDirection: "row",
    borderRadius: windowWidth * 0.025,
    padding: windowWidth * 0.025,
    margin: windowWidth * 0.015,
  },
  userItemTouchableOpacity: {
    width: windowWidth - 10,
  },
  userItemDeselected: {
    backgroundColor: backgroundColor,
  },
  userItemInfoContainer: {
    flexDirection: "row",
    flex: 1,
  },
  userItemButtonContainer: {
    alignItems: "flex-end",
    flex: 1,
    justifyContent: "center",
  },
  userItemButton: {},
  userItemIcon: {
    height: windowHeight * 0.07,
    width: windowHeight * 0.07,
    paddingRight: windowHeight * 0.005,
  },
  selected: {
    color: backgroundColor,
    backgroundColor: lightTextColor,
  },
  deselected: {
    color: lightTextColor,
    backgroundColor: backgroundColor,
  },
});
