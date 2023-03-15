import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { ACCESS_KEY, CONFIG_KEY, REFRESH_KEY, TEMPUSERID_KEY, TEMPUSERPASS_KEY } from "../../Constants/securestoreKey";
import { FontAwesome } from "@expo/vector-icons";
import { windowWidth, backgroundColor, windowHeight } from "../../Constants/cssConst";
import ToggleFood from "../../Components/InitialStep/ToggleFood";
import Footer from "../../Components/InitialStep/Footer";
import { FoodCheck } from "../../Types/InitialSteps";
import axios from "axios";
import { AuthAPI, FoodAPI } from "../../Constants/backendAPI";
import _ from "lodash";
import SearchBar from "../../Components/InitialStep/SearchBar";
import Modal from "react-native-modal";
import ToggleFoodForSearch from "../../Components/InitialStep/ToggleFoodForSearch";
import { setItemAsync } from "expo-secure-store";
import normalAxios from "../../Utils/normalAxios";
import useFoodFetch from "../../Hooks/useFoodFetch";
import useSearchFoodFetch from "../../Hooks/useSearchFoodFetch";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectFoodScreen">;

const SelectFoodScreen: React.FC<Props> = ({ navigation, route }) => {
  // submiting state
  const [startSubmit, setStartSubmit] = useState(false);
  const [loadingText, setLoadingText] = useState("Creating new account");

  const [foods, setFoods, foodPageAdd] = useFoodFetch(route.params.TargetTags);
  const [searchModeController, searchFoodsController] = useSearchFoodFetch(foods);
  // ANCHOR submit function
  const submit = async () => {
    setStartSubmit(true);
    let tempData = undefined;
    // reset function
    // phase 1 register a temp user
    try {
      const res = await normalAxios({
        method: "post",
        url: `${AuthAPI}/register`,
        data: {
          isTemp: true,
          foodIds: [...foods.filter((food) => food.checked === true).map((food) => food.id)],
          tagIds:route.params.TargetTags,
          name: "__default",
        },
      });
      await setItemAsync(TEMPUSERID_KEY, res.data.data.tmpId);
      await setItemAsync(TEMPUSERPASS_KEY, res.data.data.tmpPass);
      tempData = {
        id: res.data.data.tmpId,
        pass: res.data.data.tmpPass,
      };
    } catch (error) {
      setStartSubmit(false);
      return console.log("Submit Error", "Submit failed in phase 1");
    }

    // phase 2 login with temp user
    // prettier-ignore
    if(tempData === undefined){return console.log("Submit process failed with tempUserRegisterDate === undifined.")}
    setLoadingText("Login process");
    try {
      const res = await normalAxios({
        method: "post",
        url: `${AuthAPI}/login`,
        data: {
          username: tempData.id,
          password: tempData.pass,
        },
      });
      await setItemAsync(ACCESS_KEY, res.data.data.accessToken);
      await setItemAsync(REFRESH_KEY, res.data.data.refreshToken);
      await setItemAsync(CONFIG_KEY, "Completed");
      console.log("saved");
      navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: "HomeDrawerNavigation" }],
        })
      );
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 2");
    }
  };


  // search modal on reached end handler
  const onModalScrollToBottom = () => {
    searchFoodsController.pageAdd();
  };


  // ANCHOR skip setting function
  const skipSetting = async () => {
    setStartSubmit(true);
    let tempData = undefined;
    // phase 1 register a temp user
    try {
      const res = await normalAxios({
        method: "post",
        url: `${AuthAPI}/register`,
        data: {
          isTemp: true,
          foodIds: [],
          name: "__default",
        },
      });
      await setItemAsync(TEMPUSERID_KEY, res.data.data.tmpId);
      await setItemAsync(TEMPUSERPASS_KEY, res.data.data.tmpPass);
      console.log(res.data.data);
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
      const res = await normalAxios({
        method: "post",
        url: `${AuthAPI}/login`,
        data: {
          username: tempData.id,
          password: tempData.pass,
        },
      });
      await setItemAsync(ACCESS_KEY, res.data.data.accessToken);
      await setItemAsync(REFRESH_KEY, res.data.data.refreshToken);
      await setItemAsync(CONFIG_KEY, "Completed");
      console.log("saved");
      navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: "HomeDrawerNavigation" }],
        })
      );
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 2");
    }
  };


  //ANCHOR render item for foods flatlist
  const renderItemFood = useCallback(
    ({ item, index }: { item: FoodCheck; index: number }) => {
      function onFoodPressHandler() {
        // set foods checked status
        setFoods((prev) => {
          prev.splice(index, 1, { ...item, checked: !item.checked });
          return [...prev];
        });
      }
      return <ToggleFood food={item} onPressHandler={onFoodPressHandler} />;
    },
    [foods]
  );

  // ANCHOR render item for search foods flatlist
  const renderItemFoodSearch = useCallback(
    ({ item, index }: { item: FoodCheck; index: number }) => {
      function onSearchFoodPressHandler() {
        console.log("item status: ", item.checked);
        // set foods & searchFoods checked status depands on the checked value
        if (item.checked === false) {
          console.log("false!!!!!");
          // if not checked
          setFoods((prev) => {
            prev = [...prev, { ...item, checked: true }];
            return [...prev];
          });
          searchFoodsController.setSearchFoods((prev) => {
            prev.splice(index, 1, { ...item, checked: !item.checked });
            return [...prev];
          });
        } else {
          console.log("true!!!!!");
          // if checked
          setFoods((prev) => {
            prev.splice(index, 1, { ...item, checked: !item.checked });
            return [...prev];
          });
          searchFoodsController.setSearchFoods((prev) => {
            prev.splice(index, 1, { ...item, checked: !item.checked });
            return [...prev];
          });
        }
      }
      return <ToggleFoodForSearch food={item} onPressHandler={onSearchFoodPressHandler}></ToggleFoodForSearch>;
    },
    [searchFoodsController.searchFoods]
  );

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
          <TouchableOpacity
            style={styles.header}
            onPress={() => {
              console.log(foods.filter((food) => food.checked === true).map((food) => food.name));
            }}
          >
            <Text style={styles.headerFont}>
              お気入り料理を{"\n"}
              選択してください
            </Text>
          </TouchableOpacity>
          {/* search Btn */}
          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={() => {
                searchModeController.startSearchMode();
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
          {/* food flatlist */}
          <FlatList
            data={foods}
            extraData={foods}
            onEndReached={() => foodPageAdd()}
            keyExtractor={(item) => item.id}
            style={styles.foodsContainer}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            numColumns={2}
            renderItem={renderItemFood}
          />
          {/* footer */}
          <Footer goBackFunc={() => navigation.pop()} goNextFunc={() => submit()} skipFunc={() => skipSetting()} />
          {searchModeController.searchMode ? (
            <Modal isVisible={searchModeController.searchMode} onBackdropPress={() => searchModeController.endSearchMode()} style={styles.modal}>
              <View style={styles.modalBackground}>
                <SearchBar input={searchFoodsController.input} setInput={searchFoodsController.setInput} placeholderText="料理を入力してください" searchFunction={(input:string) => searchFoodsController.debounceSearchFoodFunction(input)}></SearchBar>
                {/* searchFoods flatlist */}
                <FlatList
                  data={searchFoodsController.searchFoods}
                  // extraData={searchFoods}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.foodsContainer}
                  columnWrapperStyle={{ justifyContent: "space-evenly" }}
                  numColumns={2}
                  onEndReached={() => onModalScrollToBottom()}
                  renderItem={renderItemFoodSearch}
                />
                {/* modal footer */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    onPress={() => {
                      searchModeController.endSearchMode();
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