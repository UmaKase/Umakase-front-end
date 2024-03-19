import React, { useCallback, useContext } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BookmarkedStackProps } from '../../../Types/Navigations/HomeDrawer/BookmarkedStack'
import Background from '../../../Components/Universal/Background';
import { FontAwesome } from '@expo/vector-icons';
import { windowWidth, lightTextColor, windowHeight, paddingLarge, darkerBackgroundColor } from '../../../Constants/cssConst';
import customAxiosInstance from '../../../Utils/customAxiosInstance';
import { FoodCheck } from '../../../Types/InitialSteps';
import { RoomAPI } from '../../../Constants/backendAPI';
import useFoodFetch from '../../../Hooks/useFoodFetch';
import ToggleFood from '../../../Components/InitialStep/ToggleFood';
import FoodList from '../../../Components/InitialStep/FoodList';
import ListFooterComponent from '../../../Components/Universal/ListFooterComponent';
import { BookmarkContext } from '../../../Context/BookmarkContext';
import { globalNavigationService } from '../../../Ref';
import { CommonActions } from '@react-navigation/native';


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

// ANCHOR Header component
type HeaderType = {
  goBackFunction: () => void
}
const Header: React.FC<HeaderType> = ({ goBackFunction }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.subIconView}>
        <TouchableOpacity onPress={goBackFunction}>
          <FontAwesome name="chevron-left" size={windowWidth * 0.07} color={lightTextColor} />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>料理追加</Text>
      <View style={styles.subIconView}></View>
    </View>
  )
}

// ANCHOR Footer component
type FooterType = {
  searchFunction: () => void;
}
const Footer: React.FC<FooterType> = ({ searchFunction }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.searchButton} onPress={searchFunction}>
        <Text style={styles.searchButtonTextStyle}>検索</Text>
      </TouchableOpacity>
    </View>
  )
}


// ANCHOR Screen
type SearchFoodResultScreenProps = NativeStackScreenProps<BookmarkedStackProps, "SearchFoodResultScreen">;

const SearchFoodResultScreen: React.FC<SearchFoodResultScreenProps> = ({ route, navigation }) => {
  const { tags, searchFood } = route.params;
  const { reloader, bookmarkedFood } = useContext(BookmarkContext);
  
  const [foodsController] = useFoodFetch(false, tags, searchFood, bookmarkedFood);


  // ANCHOR FlatList render item
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

  // search function for submit button
  async function submitFoodsFunction() {
    try {
      // submit the foods you want to add to your database
      const submitFoodsResponse = await customAxiosInstance({
        method: 'post',
        url: `${RoomAPI}/add-food`,
        data: {
          foodIds: foodsController.getSelectedFoods().map((food) => food.id)
        }
      })
      console.log(submitFoodsResponse.data);
      reloader.setFavoriteFoodScreenReload_KEY(true);
      globalNavigationService("BookMark")?.dispatch(CommonActions.reset({
        index: 1,
        routes: [
          { name: "BookmarkScreen" },
          { name: "FavoriteFoodScreen" },
        ]
      }))

    } catch (error) {
      Alert.alert("エラー", "料理の追加に失敗しました");
      console.log("submitFoodsFunction:", error);
      globalNavigationService("BookMark")?.dispatch(CommonActions.reset({
        index: 1,
        routes: [
          { name: "BookmarkScreen" },
          { name: "FavoriteFoodScreen" },
        ]
      }))
    }
  }

  return (
    <Background headerOption={false}>
      <Header goBackFunction={() => navigation.pop()} />
      <FoodList
        foods={foodsController.foods.length % 2 === 0 ? foodsController.foods : [...foodsController.foods, emptyFood]}
        onEndReached={foodsController.foodPageAdd}
        renderItem={renderItemFood}
        listFooterComponent={() => {
          return <ListFooterComponent reachedEnd={foodsController.foodListEnd} reachedEndText={"You have reached the end of the foods list"} />
        }}
      />
      <Footer searchFunction={submitFoodsFunction} />
    </Background>
  )
}

export default SearchFoodResultScreen

const styles = StyleSheet.create({
  // header
  headerContainer: {
    width: windowWidth,
    height: windowHeight * 0.07,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: paddingLarge,
  },
  subIconView: {
    width: windowWidth * 0.1,
    height: windowHeight * 0.07,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: windowHeight * 0.04,
    color: lightTextColor,
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,
  },

  // footer
  footerContainer: {
    width: windowWidth,
    height: windowHeight * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButton: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    borderRadius: windowWidth * 0.05,
    backgroundColor: "#FFF"
  },
  searchButtonTextStyle: {
    color: darkerBackgroundColor,
    fontSize: windowWidth * 0.04,
  }
})