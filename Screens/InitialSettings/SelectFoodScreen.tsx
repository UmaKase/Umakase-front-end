import React, { useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { windowWidth, backgroundColor, windowHeight } from "../../Constants/cssConst";
import ToggleFood from "../../Components/InitialStep/ToggleFood";
import Footer from "../../Components/InitialStep/Footer";
import { FoodCheck } from "../../Types/InitialSteps";
import SearchBar from "../../Components/InitialStep/SearchBar";
import Modal from "react-native-modal";
import ToggleFoodForSearch from "../../Components/InitialStep/ToggleFoodForSearch";
import useFoodFetch from "../../Hooks/useFoodFetch";
import useSearchFoodFetch from "../../Hooks/useSearchFoodFetch";
import useSubmit from "../../Hooks/InitialStage/useSubmit";
import SubmitStatus from "../../Components/InitialStep/SubmitStatus";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectFoodScreen">;

const SelectFoodScreen: React.FC<Props> = ({ navigation, route }) => {

  // SECTION custom hooks => Logic control
  // food and search food custom hook
  const [foodsController] = useFoodFetch(route.params.TargetTags);
  const [searchModeController, searchFoodsController] = useSearchFoodFetch(foodsController.foods);
  // useSubmit custom hook
  const [submitStart, loadingText, submit] = useSubmit();
  // !SECTION ============================================================

  // SECTION FlatList render item
  //ANCHOR Render item => foods FlatList
  const renderItemFood = useCallback(
    ({ item, index }: { item: FoodCheck; index: number }) => {
      function onFoodPressHandler() {
        // set foods checked status
        foodsController.setFoods((prev) => {
          prev.splice(index, 1, { ...item, checked: !item.checked });
          return [...prev];
        });
      }
      return <ToggleFood food={item} onPressHandler={onFoodPressHandler} />;
    },
    [foodsController.foods]
  );

  // ANCHOR Render item => search foods FlatList
  const renderItemFoodSearch = useCallback(
    ({ item, index }: { item: FoodCheck; index: number }) => {
      function onSearchFoodPressHandler() {
        // NOTE Check if the search food is already in the food list
        const itemAlreadyInFoods = foodsController.foods.find((food) => food.id === item.id);
        // NOTE setFoods function change due to the food is in the list or not
        if (itemAlreadyInFoods) {
          // set food checked to opposite if the food match itemAlreadyInFoods
          foodsController.setFoods(prev => prev.map((food) => {
            if (food.id === itemAlreadyInFoods.id) {
              return { ...food, checked: !food.checked };
            }
            return food
          }))
        } else {
          foodsController.setFoods((prev) => [...prev, { ...item, checked: !item.checked }]);
        }
        // NOTE setSearchFoods
        searchFoodsController.setSearchFoods((prev) => {
          prev.splice(index, 1, { ...item, checked: !item.checked });
          return [...prev]
        })
      }
      return <ToggleFoodForSearch food={item} onPressHandler={onSearchFoodPressHandler}></ToggleFoodForSearch>;
    },
    [foodsController.foods, searchFoodsController.searchFoods]
  );
  // !SECTION ============================================================

  // SECTION Components
  // Header
  const Header: React.FC = () => (
    <View>
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          console.log(foodsController.foods.filter((food) => food.checked === true).map((food) => food.name));
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
    </View>
  )

  // foods FlatList
  const FoodList: React.FC = React.memo(() => <FlatList
    data={foodsController.foods}
    extraData={foodsController.foods}
    onEndReached={() => foodsController.foodPageAdd()}
    keyExtractor={(item) => item.id}
    style={styles.foodsContainer}
    columnWrapperStyle={{ justifyContent: "space-evenly" }}
    numColumns={2}
    renderItem={renderItemFood}
  />,);

  // !SECTION ============================================================

  return (
    <SafeAreaProvider style={{ alignItems: "center", justifyContent: "center", backgroundColor: submitStart ? backgroundColor : "#FFF" }}>
      {submitStart ? (
        <SubmitStatus loadingText={loadingText} />
      ) : (
        <SafeAreaView style={styles.safeArea}>
          <Header />
          {/* ANCHOR foods FlatList */}
          <FlatList
            data={foodsController.foods}
            extraData={foodsController.foods}
            onEndReached={() => foodsController.foodPageAdd()}
            keyExtractor={(item) => item.id}
            style={styles.foodsContainer}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            numColumns={2}
            renderItem={renderItemFood}
          />
          <Footer goBackFunc={() => navigation.pop()} goNextFunc={() => submit({ tags: route.params.TargetTags, foods: foodsController.foods, getSelectedFoods: foodsController.getSelectedFoods })} skipFunc={() => submit({})} />
          {/* ANCHOR Search food modal */}
          {!searchModeController.searchMode ? <></> : <Modal isVisible={searchModeController.searchMode} onBackdropPress={searchModeController.endSearchMode} style={styles.modal}>
            <View style={styles.modalBackground}>
              <SearchBar input={searchFoodsController.input} setInput={searchFoodsController.setInput} placeholderText="料理を入力してください" searchFunction={(input: string) => searchFoodsController.debounceSearchFoodFunction(input)}></SearchBar>
              {/*ANCHOR FlatList => SearchFoods */}
              <FlatList
                data={searchFoodsController.searchFoods}
                // extraData={searchFoods}
                keyExtractor={(item, index) => index.toString()}
                style={styles.foodsContainer}
                columnWrapperStyle={{ justifyContent: "space-evenly" }}
                numColumns={2}
                onEndReached={() => searchFoodsController.pageAdd()}
                renderItem={renderItemFoodSearch}
              />
              {/* modal footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={searchModeController.endSearchMode}
                  style={styles.modalSubmit}
                >
                  <Text style={styles.modalSubmitText}>確定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>}
        </SafeAreaView>
      )}
    </SafeAreaProvider >
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