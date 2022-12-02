import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Food } from "../../Types/InitialSteps";
import {
  backgroundColor,
  drawerColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { ImgAPI } from "../../Constants/backendAPI";
import CacheImage from "../Universal/CacheImage";

interface ToggleFoodProps {
  food: Food;
  checked: boolean;
  onPressHandler: () => void;
}

const ToggleFood: React.FC<ToggleFoodProps> = ({
  food,
  checked,
  onPressHandler,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPressHandler();
      }}
      style={[
        styles.cardBackground,
        { backgroundColor: checked ? "#FFF" : backgroundColor },
      ]}
    >
      <View style={styles.imgContainer}>
        {food.img ? (
          <CacheImage url={`${ImgAPI}/food/${food.img}`} style={styles.img} />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "#777" }}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.nameContainer}>
        <Text
          style={[styles.name, { color: checked ? backgroundColor : "#FFF" }]}
        >
          {food.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ToggleFood;

const width = windowWidth * 0.35;
const height = (width * 4) / 3;
const borderRadius = windowWidth * 0.04;

const styles = StyleSheet.create({
  cardBackground: {
    width: width,
    height: height,
    borderRadius: borderRadius,
    marginVertical: windowHeight * 0.01,
  },
  imgContainer: {
    flex: 3,
    resizeMode: "contain",
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    backgroundColor: drawerColor,
    // alignItems: "center",
    // justifyContent: "center",
  },
  img: {
    flex: 1,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    resizeMode: "cover",
  },
  nameContainer: {
    flex: 1,
    borderRadius: borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: windowWidth * 0.04,
    flexWrap: "wrap",
  },
});
