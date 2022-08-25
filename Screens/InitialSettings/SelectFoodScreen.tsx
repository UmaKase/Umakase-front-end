import React, { useEffect, useState } from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { CONFIG_KEY } from "../../Constants/securestoreKey";
import { FontAwesome } from "@expo/vector-icons";
import {
  drawerColor,
  windowWidth,
  backgroundColor,
  windowHeight,
} from "../../Constants/cssConst";
import ToggleCard from "../../Components/InitialStep/ToggleCard";
import Footer from "../../Components/InitialStep/Footer";
import { Food } from "../../types/InitialSteps";
import axios from "axios";
import { FoodAPI } from "../../Constants/backendAPI";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectFoodScreen">;

const SelectFoodScreen: React.FC<Props> = ({ navigation, route }) => {
  // food var
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [food, setFoods] = useState<Food[]>([]);
  // target tag list
  const tags: string[] = ["簡単"];
  // text input state
  const [inputText, setInputText] = useState<string>("");

  // fetch Food API
  const fetchFoods = async () => {
    axios({
      url: `${FoodAPI}/db?tagName=${tags[0]}`,
      method: "get",
    })
      .then((res) => {
        setFoods(res.data.foods);
      })
      .catch((e) => console.log(e.response));
  };

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
    // fetch foods
    fetchFoods();
  }, []);

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
        <View style={styles.searchbarContainer}>
          <TextInput
            style={styles.searchbar}
            onChangeText={(newText) => setInputText(newText)}
            value={inputText}
            placeholder="enter food name to find"
            placeholderTextColor={drawerColor}
            autoCapitalize="none"
            selectionColor="#FFF"
            // caretHidden={true}
          ></TextInput>
          <View style={styles.searchBtn}>
            <TouchableOpacity onPress={() => {}}>
              <FontAwesome
                name="search"
                size={windowWidth * 0.07}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* card container */}
        <FlatList
          data={food}
          keyExtractor={(item, index) => index.toString()}
          style={styles.cardContainer}
          numColumns={2}
          renderItem={({ item }) => {
            const isChecked = selectedFood.find((foodId) => foodId === item.id)
              ? true
              : false;
            return (
              <ToggleCard
                tag={item}
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
              ></ToggleCard>
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
