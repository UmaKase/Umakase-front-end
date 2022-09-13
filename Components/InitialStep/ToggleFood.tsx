import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Food } from "../../types/InitialSteps";
import {
  backgroundColor,
  drawerColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { ImgAPI } from "../../Constants/backendAPI";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY } from "../../Constants/securestoreKey";

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
  const [img, setImg] = useState<string>();

  const fetchImg = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "get",
      responseType: "blob",
      headers: { Authorization: `Bearer ${localAccessToken}` },
      url: `${ImgAPI}/food/${food.img}`,
    })
      .then((res) => {
        setImg(URL.createObjectURL(res.data));
      })
      .catch((e) => {
        console.error("this is error :" + e);
      });
  };

  useEffect(() => {
    fetchImg();
    return () => {};
  }, []);

  return (
    <TouchableOpacity
      onPress={onPressHandler}
      style={[
        styles.cardBackground,
        { backgroundColor: checked ? "#FFF" : backgroundColor },
      ]}
    >
      <View style={styles.imgContainer}>
        <Image
          // source={{ uri: "data:image/jpeg;base64," + img }}
          source={{ uri: img }}
          style={styles.img}
          resizeMode="cover"
        ></Image>
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
    width: width - 0.1,
    height: height,
    borderRadius: borderRadius,
    // marginLeft: windowWidth * 0.1,
    marginVertical: windowHeight * 0.01,
  },
  imgContainer: {
    flex: 3,
    resizeMode: "contain",
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    backgroundColor: drawerColor,
  },
  img: {
    flex: 1,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    resizeMode: "contain",
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
    // flexShrink: 1,
  },
});
