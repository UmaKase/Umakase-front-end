import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Food } from "../../Types/InitialSteps";
import {
  backgroundColor,
  drawerColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { ImgAPI } from "../../Constants/backendAPI";
import axios from "axios";

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
    if (food.img) {
      axios({
        method: "get",
        responseType: "blob",
        url: `${ImgAPI}/food/${food.img}`,
      })
        .then((res) => {
          setImg(URL.createObjectURL(res.data));
        })
        .catch((e) => {
          console.log("this is error :" + e);
        });
    } else {
      setImg(undefined);
    }
  };

  useEffect(() => {
    fetchImg();
    console.log(food.img);
  }, [food.img]);

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
        {img ? (
          <Image
            source={{ uri: img }}
            style={styles.img}
            resizeMode="cover"
          ></Image>
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
  },
});
