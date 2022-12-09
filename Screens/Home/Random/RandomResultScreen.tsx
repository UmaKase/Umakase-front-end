import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RandomStackNavigationProps } from "../../../Types/Navigations/HomeDrawer/RandomStack";
import Background from "../../../Components/Universal/Background";
import {
  textMedium,
  windowHeight,
  windowWidth,
} from "../../../Constants/cssConst";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
import { FoodAPI, ImgAPI } from "../../../Constants/backendAPI";
import CacheImage from "../../../Components/Universal/CacheImage";
import CenterActivityIndicator from "../../../Components/Universal/CenterActivityIndicator";

type RandomResultScreenProps = NativeStackScreenProps<
  RandomStackNavigationProps,
  "RandomResultScreen"
>;
const RandomResultScreen: React.FC<RandomResultScreenProps> = ({
  route,
  navigation,
}) => {
  // getting room id & name from the route
  const { roomId, roomName } = route.params;
  // fetching state
  const [fetching, setFetching] = useState<boolean>(true);

  // food info
  const [foodName, setFoodName] = useState<string>("foodname");
  const [foodImgUrl, setFoodImgUrl] = useState<string>("");

  // fetch random food function
  const randomFoodFunction = async () => {
    setFetching(true);
    customAxiosInstance({
      method: "get",
      url: `${FoodAPI}/random/${roomId}`,
    }).then((res) => {
      // console.log(res.data.data.randomFoods[0].img);
      setFoodName(res.data.data.randomFoods[0].name);
      setFoodImgUrl(`${ImgAPI}/food/${res.data.data.randomFoods[0].img}`);
      setFetching(false);
    });
  };
  // useEffect for initial loading
  useEffect(() => {
    randomFoodFunction();
    return () => {};
  }, []);

  // go back to random screen
  const goBackRandomScreen = () => {
    navigation.navigate("RandomScreen");
  };
  return (
    <Background>
      <View style={styles.foodCircle}>
        {fetching ? (
          <CenterActivityIndicator size="large" color="#FFF" />
        ) : (
          <CacheImage url={foodImgUrl} style={styles.foodImgStyle} />
        )}
      </View>
      <View style={styles.controlBar}>
        <TouchableOpacity onPress={goBackRandomScreen}>
          <FontAwesome
            name="chevron-left"
            size={windowWidth * 0.08}
            color="#FFF"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("heart btn")}>
          <FontAwesome5 name="heart" size={windowWidth * 0.08} color="#FFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.foodName}>{foodName}</Text>
      <View style={styles.decisionBar}>
        <TouchableOpacity
          onPress={randomFoodFunction}
          style={[styles.decisionButton, { backgroundColor: "#ECAC72" }]}
        >
          <Text style={styles.decisionButtonText}>次の料理</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("削除する")}
          style={[styles.decisionButton, { backgroundColor: "#F44D4D" }]}
        >
          <Text style={styles.decisionButtonText}>削除する</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default RandomResultScreen;

const styles = StyleSheet.create({
  controlBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: windowWidth * 0.07,
    position: "relative",
    bottom: windowHeight * 0.37,
  },

  foodCircle: {
    height: windowWidth * 0.8,
    width: windowWidth * 0.8,
    borderRadius: windowWidth * 0.4,
    borderWidth: 15,
    borderColor: "#FFF",
    padding: 5,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: windowHeight * 0.05,
  },
  foodImgStyle: {
    flex: 1,
    borderRadius: windowWidth * 0.4,
    resizeMode: "cover",
  },
  foodName: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: windowWidth * 0.08,
    color: "#FFF",
  },

  // decision btn
  decisionBar: {
    width: windowWidth * 0.65,
    marginTop: windowHeight * 0.1,
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  decisionButton: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.06,
    borderRadius: windowWidth * 0.04,
    alignItems: "center",
    justifyContent: "center",
  },
  decisionButtonText: {
    fontSize: textMedium,
    color: "#FFF",
  },
});
