import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY, CONFIG_KEY } from "../../Constants/securestoreKey";
import { FontAwesome } from "@expo/vector-icons";
import {
  windowWidth,
  backgroundColor,
  windowHeight,
} from "../../Constants/cssConst";
import ToggleFood from "../../Components/InitialStep/ToggleFood";
import Footer from "../../Components/InitialStep/Footer";
import { Food } from "../../types/InitialSteps";
import axios from "axios";
import { FoodAPI } from "../../Constants/backendAPI";
import _ from "lodash";
import SearchBar from "../../Components/InitialStep/SearchBar";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectFoodScreen">;

const SelectFoodScreen: React.FC<Props> = ({ navigation, route }) => {
  // food var
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [food, setFoods] = useState<Food[]>([]);
  // text input state
  const [inputText, setInputText] = useState<string>("");
  const [page, setPage] = useState(1);

  // search food
  const [searchMode, setSearchMode] = useState(false);

  // on reach end flatlist request
  const onEndReachedHandler = () => {
    setPage((prev) => prev + 1);
  };

  // search food
  const debounceSearchFood = useCallback(
    _.debounce(async (input: string) => {
      const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
      console.log(input);
      // axios({
      //   method: "post",
      //   url: `${FoodAPI}/db`,
      //   data: {
      //     target: input,
      //     foods: selectedFood,
      //   },
      // })
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((e) => Alert.alert("Error", e));
    }, 500),
    []
  );

  // setting complete function
  const settingComplete = async () => {
    await SecureStore.setItemAsync(CONFIG_KEY, "Completed");
    console.log("saved");
    navigation.dispatch(
      CommonActions.reset({ routes: [{ name: "HomeDrawerNavigation" }] })
    );
  };
  // skip setting function
  const skipSetting = async () => {
    await SecureStore.setItemAsync(CONFIG_KEY, "Completed");
    console.log("saved");
    navigation.dispatch(
      CommonActions.reset({ routes: [{ name: "HomeDrawerNavigation" }] })
    );
  };

  useEffect(() => {
    console.log(`${FoodAPI}/db?take=20&page=${page}`);
    // fetch foods
    axios({
      url: `${FoodAPI}/db?take=20&page=${page}`,
      method: "post",
      data: {
        tagIds: route.params.TargetTags,
      },
    })
      .then((res) => {
        setFoods((prev) => [...prev, ...res.data.foods]);
      })
      .catch((e) => console.log(e.response));
  }, [page]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerFont}>
            お気入り料理を{"\n"}
            選択してください
          </Text>
        </View>
        {/* search bar */}
        <SearchBar
          input={inputText}
          setInput={setInputText}
          placeholderText="enter food name to search"
          searchFunction={(input: string) => {
            debounceSearchFood(input);
          }}
          searchBtnFunc={() => {}}
        ></SearchBar>
        {/* tag container */}
        <FlatList
          data={food}
          onEndReached={() => onEndReachedHandler()}
          keyExtractor={(item, index) => index.toString()}
          style={styles.cardContainer}
          columnWrapperStyle={{ justifyContent: "space-evenly" }}
          numColumns={2}
          renderItem={({ item }) => {
            const isChecked = !!selectedFood.find!!(
              (foodId) => foodId === item.id
            );
            return (
              <ToggleFood
                food={item}
                checked={isChecked}
                onPressHandler={() => {
                  if (isChecked) {
                    setSelectedFood((prev) =>
                      prev.filter((id) => id !== item.id)
                    );
                  } else {
                    setSelectedFood((prev) => [...prev, item.id]);
                  }
                }}
              ></ToggleFood>
            );
          }}
        />
        {/* footer */}
        <Footer
          goBackFunc={() => navigation.goBack()}
          goNextFunc={() => settingComplete()}
          skipFunc={() => skipSetting()}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SelectFoodScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  header: {
    height: windowHeight * 0.12,
    width: windowWidth,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingLeft: windowWidth * 0.1,
  },
  headerFont: {
    fontSize: windowWidth * 0.08,
    color: "#FFF",
  },
  searchbarContainer: {
    width: windowWidth,
    height: windowHeight * 0.06,
    flexDirection: "row",
    paddingLeft: windowWidth * 0.1,
    paddingRight: windowWidth * 0.05,
  },
  searchbar: {
    flex: 5,
    fontSize: windowWidth * 0.065,
    color: "#FFF",
  },
  searchBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    flex: 1,
  },
});
