import React, { useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { windowWidth, backgroundColor, windowHeight } from "../../Constants/cssConst";
import ToggleFood from "../../Components/InitialStep/ToggleFood";
import Footer from "../../Components/InitialStep/Footer";
import { FoodCheck } from "../../Types/InitialSteps";
import SearchBar from "../../Components/InitialStep/SearchBar";
import ToggleFoodForSearch from "../../Components/InitialStep/ToggleFoodForSearch";
import useFoodFetch from "../../Hooks/useFoodFetch";
import useSearchFoodFetch from "../../Hooks/useSearchFoodFetch";
import useSubmit from "../../Hooks/InitialStage/useSubmit";
import SubmitStatus from "../../Components/InitialStep/SubmitStatus";
import FoodList from "../../Components/InitialStep/FoodList";
import SearchModal from "../../Components/Universal/SearchModal";
import ListFooterComponent from "../../Components/Universal/ListFooterComponent";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectFoodScreen">;


const SelectFoodScreen: React.FC<Props> = ({ navigation, route }) => {

  // SECTION custom hooks => Logic control
  // food and search food custom hook
  const [foodsController] = useFoodFetch(route.params.tagIds);
  const [searchModeController, searchFoodsController] = useSearchFoodFetch(foodsController.foods);
  // useSubmit custom hook
  const [submitStart, loadingText, submit] = useSubmit();
  // empty FoodCheck as fake data for food list while the length%2 !== 0
  const emptyFood: FoodCheck = {
    altName: "",
    country: "",
    createdAt: "",
    id: "",
    img: "",
    name: "",
    updatedAt: "",
    checked: false,
  }
  // !SECTION ============================================================

  // SECTION FlatList render item
  //ANCHOR Render item => foods FlatList
  const renderItemFood = useCallback(
    ({ item, index }: { item: FoodCheck; index: number }) => {
      function onFoodPressHandler() {
        // set foods checked status
        foodsController.setFoods((prev) => {
          const newState = [...prev];
          newState.splice(index, 1, { ...item, checked: !item.checked });
          return newState;
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
          foodsController.setFoods(prev => {
            const newState = [...prev];
            const foodIndex = newState.findIndex((food) => food.id === item.id);
            newState.splice(foodIndex, 1, { ...item, checked: !item.checked });
            return newState;
          })
        } else {
          foodsController.setFoods((prev) => {
            const newState = [...prev, { ...item, checked: !item.checked}];
            return newState;
          });
        }
        // NOTE setSearchFoods
        searchFoodsController.setSearchFoods((prev) => {
          const newState = [...prev];
          newState.splice(index, 1, { ...item, checked: !item.checked });
          return newState;
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

  // ModalFooter
  const ModalFooter: React.FC = () => (
    <View style={styles.modalFooter}>
      <TouchableOpacity
        onPress={searchModeController.endSearchMode}
        style={styles.modalSubmit}
      >
        <Text style={styles.modalSubmitText}>確定</Text>
      </TouchableOpacity>
    </View>
  )

  // !SECTION ============================================================

  return (
    <SafeAreaProvider style={{ alignItems: "center", justifyContent: "center", backgroundColor: submitStart ? backgroundColor : "#FFF" }}>
      {submitStart ? (
        <SubmitStatus loadingText={loadingText} />
      ) : (
        <SafeAreaView style={styles.safeArea}>
          <Header />
          {/* ANCHOR foods FoodList */}
          <FoodList
            foods={foodsController.foods.length % 2 === 0 ? foodsController.foods : [...foodsController.foods, emptyFood]}
            onEndReached={foodsController.foodPageAdd}
            renderItem={renderItemFood}
            listFooterComponent={()=>{
              return <ListFooterComponent reachedEnd={foodsController.foodListEnd} reachedEndText={"You have reached the end of the foods list"} />
            }}
          />
          <Footer goBackFunc={() => navigation.pop()} goNextFunc={() => submit({ selectedTags:route.params.tags , selectedTagsId: route.params.tagIds, foods: foodsController.foods, getSelectedFoods: foodsController.getSelectedFoods })} skipFunc={() => submit({})} />
          {/* ANCHOR Search food modal */}
          <SearchModal visible={searchModeController.searchMode} onBackdropPress={searchModeController.endSearchMode} >
            <SearchBar input={searchFoodsController.input} setInput={searchFoodsController.setInput} placeholderText="料理を入力してください" searchFunction={(input: string) => searchFoodsController.debounceSearchFoodFunction(input)} />
            {/*ANCHOR search foods FoodList */}
            <FoodList
              foods={searchFoodsController.searchFoods.length % 2 === 0 ? searchFoodsController.searchFoods : [...searchFoodsController.searchFoods, emptyFood]}
              onEndReached={() => searchFoodsController.pageAdd()}
              renderItem={renderItemFoodSearch}
              listFooterComponent={() => <></>}
            />
            <ModalFooter />
          </SearchModal>
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

  // modal
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
