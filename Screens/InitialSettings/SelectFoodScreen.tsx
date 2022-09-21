import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
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
import { Food } from "../../Types/InitialSteps";
import axios from "axios";
import { FoodAPI } from "../../Constants/backendAPI";
import _ from "lodash";
import SearchBar from "../../Components/InitialStep/SearchBar";
import Modal from "react-native-modal";
import customAxiosInstance from "../../Utils/customAxiosInstance";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectFoodScreen">;

const SelectFoodScreen: React.FC<Props> = ({ navigation, route }) => {
  // food var
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [food, setFoods] = useState<Food[]>([]);
  const [page, setPage] = useState(1);
  const [foodEnd, setFoodEnd] = useState(false);

  // text input state
  const [inputText, setInputText] = useState<string>("");

  // search food
  const [searchMode, setSearchMode] = useState(false);
  const [searchFoods, setSearchFoods] = useState<Food[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchEnd, setSearchEnd] = useState(false);

  // on reach end flatlist request
  const onEndReachedHandler = () => {
    setPage((prev) => prev + 1);
  };

  // search modal on reached end handler
  const onModalScrollToBottom = () => {
    setSearchPage((prev) => prev + 1);
  };

  // leave search mode
  const leaveSearchMode = () => {
    setSearchMode(false);
    setInputText("");
    setSearchFoods([]);
    setSearchPage(1);
  };

  // search food
  const debounceSearchFood = useCallback(
    _.debounce(async (input: string) => {
      if (input === "") {
        setSearchFoods([]);
        setSearchPage(1);
      } else {
        axios({
          method: "post",
          url: `${FoodAPI}/db?name=${input}&take=20&page=${searchPage}`,
          data: {
            tagIds: [],
            excludeTagIds: [],
            excludeFoods: [],
          },
        });
      }
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
        {/* search Btn */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => {
              setSearchMode((prev) => !prev);
            }}
          >
            <FontAwesome
              name="search"
              size={windowWidth * 0.07}
              // color={backgroundColor}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
        {/* tag container */}
        <FlatList
          data={food}
          onEndReached={() => onEndReachedHandler()}
          keyExtractor={(item, index) => index.toString()}
          style={styles.foodsContainer}
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
        {searchMode ? (
          <Modal
            isVisible={searchMode}
            onBackdropPress={() => leaveSearchMode()}
            style={styles.modal}
          >
            <View style={styles.modalBackground}>
              <SearchBar
                input={inputText}
                setInput={setInputText}
                placeholderText="料理を入力してください"
                searchFunction={(input: string) => debounceSearchFood(input)}
              ></SearchBar>
              {/* flatlist loop out foods */}
              <FlatList
                data={searchFoods}
                extraData={searchFoods}
                keyExtractor={(item, index) => index.toString()}
                style={styles.foodsContainer}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                numColumns={2}
                onEndReached={() => onModalScrollToBottom()}
                renderItem={({ item, index }) => {
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
                    />
                  );
                }}
              />
              {/* modal footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={() => {
                    leaveSearchMode();
                  }}
                  style={styles.modalSubmit}
                >
                  <Text style={styles.modalSubmitText}>確定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : (
          <></>
        )}
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
  searchContainer: {
    width: windowWidth,
    height: windowHeight * 0.06,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: windowWidth * 0.1,
  },
  foodsContainer: {
    flex: 1,
  },

  // modal
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalBackground: {
    flex: 0.75,
    height: windowHeight * 0.75, //giving the height because of the flatlist need a fix height to be scrollable
    backgroundColor: "#FFF",
    borderTopLeftRadius: windowWidth * 0.05,
    borderTopRightRadius: windowWidth * 0.05,
  },
  modalFooter: {
    width: windowWidth,
    height: windowHeight * 0.15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmit: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.05,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: backgroundColor,
    borderRadius: windowWidth * 0.03,
  },
  modalSubmitText: {
    fontSize: windowWidth * 0.05,
    color: "#FFF",
  },
});
