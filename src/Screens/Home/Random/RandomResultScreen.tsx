import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RandomStackNavigationProps } from "../../../Types/Navigations/HomeDrawer/RandomStack";
import Background from "../../../Components/Universal/Background";
import { textMedium, windowHeight, windowWidth } from "../../../Constants/cssConst";
import { FontAwesome } from "@expo/vector-icons";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
import { FoodAPI, ImgAPI, RoomAPI } from "../../../Constants/backendAPI";
import CacheImage from "../../../Components/Universal/CacheImage";
import CenterActivityIndicator from "../../../Components/Universal/CenterActivityIndicator";
import { Food } from "../../../Types/types";
import { GlobalContext } from "../../../Context/GlobalContext";
import { getItemAsync } from "expo-secure-store";
import { DEFAULT_ROOM_ID_KEY } from "../../../Constants/securestoreKey";

type RandomResultScreenProps = NativeStackScreenProps<RandomStackNavigationProps, "RandomResultScreen">;
const RandomResultScreen: React.FC<RandomResultScreenProps> = ({ route, navigation }) => {
  // getting room id & name from the route
  const { currentRoomId, currentRoomName } = useContext(GlobalContext);
  // fetching state
  const [fetching, setFetching] = useState<boolean>(true);
  // foods
  const [foods, setFoods] = useState<Food[]>([]);
  // food info
  const [currentFood, setCurrentFood] = useState(0);
  // refetching foods
  const [disabledBtn, setDisabledBtn] = useState(false);
  // is favorite food
  const [isFavorite, setIsFavorite] = useState(false);

  // get next random food from foods array
  const nextFood = () => {
    setDisabledBtn(true);
    if (currentFood == 4) {
      randomFoodFunction();
      return setTimeout(() => {
        setDisabledBtn(false);
      }, 200);
    }
    setCurrentFood((prev) => prev + 1);
    return setTimeout(() => {
      setDisabledBtn(false);
    }, 200);
  };

  // like food function
  async function onLikeFoodPress() {
    try {
      await customAxiosInstance.post(`${FoodAPI}/favorite`, { foodId: foods[currentFood].id });

    } catch (error) {
      console.log('error from renderItemFavoriteFood onLikePressHandler :', error);
    }
  }

  // delete food function
  async function onRemoveFoodPress() {
    // getting default room id from secure store
    const defaultRoomId = await getItemAsync(DEFAULT_ROOM_ID_KEY);
    console.log('onRemoveFoodPress, default room id:', defaultRoomId);
    console.log('onRemoveFoodPress, current room id:', currentRoomId);
    if (currentRoomId === defaultRoomId) {
      return Alert.alert("Delete Food", `Do you want to delete ${foods[currentFood].name} from ${currentRoomName}`, [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const deleteFoodsResponse = await customAxiosInstance({
                method: 'post',
                url: `${RoomAPI}/event`,
                data: {
                  evnet: "update-food",
                  roomId: await getItemAsync(DEFAULT_ROOM_ID_KEY),
                  removeFoods: foods[currentFood].id,
                },
              })
              console.log(deleteFoodsResponse.data);
              // FIXME 2023/06/07 suppose to have the response from the server, and then delete the food from the database
              // if (deleteFoodsResponse.data.data.success) {
              //   setFoods(prev => {
              //     return prev.filter((food) => !chosenFoodsId.includes(food.food.id));
              //   })
              // }
              console.log("delete food");
            } catch (error) {
              console.log('error from trashButtonPress :', error);
            }
          },
          style: "destructive",
        }
      ]);
    } else {
      Alert.alert("This is not your own room, you can't delete food from this room.")
    }
  }

  // fetch random food function
  const randomFoodFunction = async () => {
    setFetching(true);
    await customAxiosInstance({
      method: "get",
      url: `${FoodAPI}/random/${currentRoomId}?count=5`,
    })
      .then((res) => {
        console.log(res.data.data.randomFoods[0]);
        setFoods(res.data.data.randomFoods);
        setCurrentFood(0);
      })
      .catch((err) => {
        console.log(err);
      });
    setFetching(false);
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
      {fetching ? (
        <CenterActivityIndicator size="large" color="#FFF" />
      ) : (
        <>
          <View style={styles.foodCircle}>
            <CacheImage url={`${ImgAPI}/food/${foods[currentFood].img}`} style={styles.foodImgStyle} />
          </View>
          <View style={styles.controlBar}>
            <TouchableOpacity onPress={goBackRandomScreen}>
              <FontAwesome name="chevron-left" size={windowWidth * 0.08} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("heart btn")}>
              <FontAwesome5 name="heart" size={windowWidth * 0.08} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.foodName}>{foods[currentFood].name}</Text>
          <View style={styles.decisionBar}>
            <TouchableOpacity disabled={disabledBtn} onPress={nextFood} style={[styles.decisionButton, { backgroundColor: "#ECAC72" }]}>
              <Text style={styles.decisionButtonText}>次の料理</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={disabledBtn} onPress={() => console.log("削除する")} style={[styles.decisionButton, { backgroundColor: "#F44D4D" }]}>
              <Text style={styles.decisionButtonText}>削除する</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
