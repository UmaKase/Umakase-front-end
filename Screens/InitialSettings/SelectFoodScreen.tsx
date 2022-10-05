import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {
  ACCESS_KEY,
  CONFIG_KEY,
  REFRESH_KEY,
  TEMPUSERID_KEY,
  TEMPUSERPASS_KEY,
} from "../../Constants/securestoreKey";
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
import { AuthAPI, FoodAPI, RoomAPI } from "../../Constants/backendAPI";
import _ from "lodash";
import SearchBar from "../../Components/InitialStep/SearchBar";
import Modal from "react-native-modal";
import ToggleFoodForSearch from "../../Components/InitialStep/ToggleFoodForSearch";
import customAxiosInstance from "../../Utils/customAxiosInstance";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectFoodScreen">;

const SelectFoodScreen: React.FC<Props> = ({ navigation, route }) => {
  // submiting state
  const [startSubmit, setStartSubmit] = useState(false);
  const [loadingText, setLoadingText] = useState("Creating new account");

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

  // submit function
  const submit = async () => {
    setStartSubmit(true);
    let tempData = undefined;
    let loginFlag = false;
    // reset function
    // phase 1 register a temp user
    try {
      const res = await axios({
        method: "post",
        url: `${AuthAPI}/register`,
        data: {
          isTemp: true,
        },
      });
      SecureStore.setItemAsync(TEMPUSERID_KEY, res.data.data.tmpId);
      SecureStore.setItemAsync(TEMPUSERPASS_KEY, res.data.data.tmpPass);
      tempData = {
        id: res.data.data.tmpId,
        pass: res.data.data.tmpPass,
      };
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 1");
    }

    // phase 2 login with temp user
    // prettier-ignore
    if(tempData === undefined){return console.log("Submit process failed with tempUserRegisterDate === undifined.")}
    setLoadingText("Login process");
    try {
      const res = await axios({
        method: "post",
        url: `${AuthAPI}/login`,
        data: {
          username: tempData.id,
          password: tempData.pass,
        },
      });
      SecureStore.setItemAsync(ACCESS_KEY, res.data.accessToken);
      SecureStore.setItemAsync(REFRESH_KEY, res.data.refreshToken);
      loginFlag = true;
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 2");
    }

    // phase 3
    // prettier-ignore
    if(!loginFlag){return console.log("Submit process failed with liginWithTempUser === undefined.")}
    setLoadingText("Creating user setting");
    try {
      const res = await customAxiosInstance({
        method: "post",
        url: `${RoomAPI}/new`,
        data: {
          isDefaultRoom: true,
          foodIds: selectedFood,
          name: "__default",
        },
      });
      console.log(res.data.data);
      SecureStore.setItemAsync(CONFIG_KEY, "Completed");
      console.log("saved");
      navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: "HomeDrawerNavigation" }],
        })
      );
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 3");
    }
  };

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
            tagIds: route.params.TargetTags,
            excludeFoods: selectedFood,
          },
        })
          .then((res) => {
            setSearchFoods(res.data.data.foods);
          })
          .catch((e) => console.log("food request error:", e));
      }
      console.log(input);
    }, 500),
    []
  );

  // skip setting function
  const skipSetting = async () => {
    await SecureStore.setItemAsync(CONFIG_KEY, "Completed");
    console.log("saved");
    navigation.dispatch(
      CommonActions.reset({ routes: [{ name: "HomeDrawerNavigation" }] })
    );
  };

  // get foods
  useEffect(() => {
    // fetch foods
    if (!foodEnd) {
      console.log("Target Tags", route.params.TargetTags);
      axios({
        url: `${FoodAPI}/db?take=20&page=${page}`,
        method: "post",
        data: {
          tagIds: route.params.TargetTags,
          excludeFoods: selectedFood,
        },
      })
        .then((res) => {
          if (res.data.data.foods[0]) {
            setFoods((prev) => [...prev, ...res.data.data.foods]);
          } else {
            setFoodEnd(true);
          }
        })
        .catch((e) => console.log(e.response));
    }
  }, [page]);

  // search food on reachedend handler
  useEffect(() => {
    if (searchPage !== 1 && !searchEnd) {
      axios({
        url: `${FoodAPI}/db?name=${inputText}&take=20&page=${searchPage}`,
        method: "post",
        data: {
          tagIds: route.params.TargetTags,
          excludeFoods: selectedFood,
        },
      })
        .then((res) => {
          if (res.data.data.foods[0]) {
            setSearchFoods((prev) => [...prev, ...res.data.data.foods]);
          } else {
            setSearchEnd(true);
          }
        })
        .catch((e) => console.log(e.response));
    } else {
      setSearchEnd(true);
    }
  }, [searchPage]);

  return (
    <SafeAreaProvider
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: startSubmit ? backgroundColor : "#FFF",
      }}
    >
      {startSubmit ? (
        <>
          <ActivityIndicator size="large" color="#FFF"></ActivityIndicator>
          <Text
            style={{
              color: "#FFF",
              fontSize: windowWidth * 0.05,
              marginTop: windowHeight * 0.03,
            }}
          >
            {loadingText}
          </Text>
        </>
      ) : (
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
            extraData={food}
            onEndReached={() => onEndReachedHandler()}
            // keyExtractor={(item, index) => index.toString()}
            style={styles.foodsContainer}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            numColumns={2}
            renderItem={({ item, index }) => {
              const isChecked = !!selectedFood.find!!(
                (foodId) => foodId === item.id
              );
              return (
                <ToggleFood
                  key={item.id}
                  food={item}
                  checked={isChecked}
                  onPressHandler={() => {
                    const temptFood = food[index];
                    if (isChecked) {
                      setSelectedFood((prev) =>
                        prev.filter((id) => id !== item.id)
                      );
                    } else {
                      setSelectedFood((prev) => [...prev, item.id]);
                      setFoods((prev) => {
                        return [
                          temptFood,
                          ...prev.filter(
                            (target) => target.id !== temptFood.id
                          ),
                        ];
                      });
                    }
                  }}
                ></ToggleFood>
              );
            }}
          />
          {/* footer */}
          <Footer
            goBackFunc={() => navigation.pop()}
            goNextFunc={() => submit()}
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
                  // keyExtractor={(item) => item.id}
                  style={styles.foodsContainer}
                  columnWrapperStyle={{ justifyContent: "space-evenly" }}
                  numColumns={2}
                  onEndReached={() => onModalScrollToBottom()}
                  renderItem={({ item, index }) => {
                    const isChecked = !!selectedFood.find!!(
                      (foodId) => foodId === item.id
                    );
                    return (
                      <ToggleFoodForSearch
                        key={index.toString()}
                        food={item}
                        checked={isChecked}
                        onPressHandler={() => {
                          const tempFood = searchFoods[index];
                          if (isChecked) {
                            setSelectedFood((prev) =>
                              prev.filter((id) => id !== item.id)
                            );
                          } else {
                            setSelectedFood((prev) => [...prev, item.id]);
                            setFoods((prev) => {
                              return [
                                tempFood,
                                ...prev.filter(
                                  (target) => target.id != tempFood.id
                                ),
                              ];
                            });
                            setSearchFoods((prev) => {
                              return [
                                tempFood,
                                ...prev.filter(
                                  (target) => target.id != tempFood.id
                                ),
                              ];
                            });
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
      )}
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
