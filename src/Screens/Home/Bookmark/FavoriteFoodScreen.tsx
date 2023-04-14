import { StyleSheet } from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookmarkedStackProps } from "../../../Types/Navigations/HomeDrawer/BookmarkedStack";
import Background from "../../../Components/Universal/Background";
import SearchBarForBookMark from "../../../Components/Home/Bookmark/SearchBarForBookMark";
import { backgroundColor, windowHeight, windowWidth } from "../../../Constants/cssConst";
import ControlBar from "../../../Components/Home/Bookmark/ControlBar";
import { FavoriteFoodInterface } from "../../../Types/InitialSteps";
import _ from "lodash";
import useFavoriteFoodFetch from "../../../Hooks/favoriteFood/useFavoriteFoodFetch";
import useSearchFoodFetch from "../../../Hooks/useSearchFoodFetch";
import { TagContext } from "../../../Context/TagContext";
import FavoriteFoodList from "../../../Components/Home/Bookmark/FavoriteFoodList";
import ListFooterComponent from "../../../Components/Universal/ListFooterComponent";
import FavoriteFood from "../../../Components/Home/Bookmark/FavoriteFood";
import Footer from "../../../Components/InitialStep/Footer";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
import { FoodAPI } from "../../../Constants/backendAPI";

type Props = NativeStackScreenProps<BookmarkedStackProps, "FavoriteFoodScreen">;
const FavoriteFoodScreen: React.FC<Props> = ({ route, navigation }) => {

  // empty favorite food
  const emptyFood: FavoriteFoodInterface = {
    // empty food
    food: {
      altName: "",
      country: "",
      createdAt: "",
      id: "",
      img: "",
      name: "",
      updatedAt: ""
    },
    isFavorite: false
  }

  // useFavoriteFoodFetch
  const [foods, setFoods, showFoods, localSearchInputText, setLocalSearchInputText, tags, setTags, favMode, favModeSwitch, editMode, editModeSwitch, fetching, reFetchFoods] = useFavoriteFoodFetch();
  // useSearchFoodFetch
  const [searchModeController, searchFoodsController] = useSearchFoodFetch(foods.map((food) => food.food));
  // useContext tags
  const { contextTags, setContextTags } = useContext(TagContext);

  useEffect(() => {
    setContextTags(tags);
  }, [tags, editMode])


  const renderItemFavoriteFood = useCallback(
    ({ item, index }: { item: FavoriteFoodInterface; index: number }) => {
      // toggle isFavorite status of the favFood in foods
      const onLikePressHandler = async () => {
        try {
          await customAxiosInstance.post(`${FoodAPI}/favorite`, { foodId: item.food.id });
          setFoods(prev => {
            const newFoods = [...prev];
            newFoods[index].isFavorite = !newFoods[index].isFavorite;
            return newFoods;
          })
        } catch (error) {
          console.log('error from renderItemFavoriteFood onLikePressHandler :', error);
        }
      }
      // delete the favFood in foods
      const onDeletePressHandler = () => {
        try {
          // call delete food api
          // api call
          setFoods((prev) => {
            const newFoods = [...prev];
            newFoods.splice(index, 1);
            return newFoods;
          })
        } catch (error) {
          console.log('error from renderItemFavoriteFood onDeletePressHandler :', error)
        }
      }
      return (
        <FavoriteFood
          favFood={item}
          onLikePressHandler={onLikePressHandler}
          onDeletePressHandler={onDeletePressHandler}
          editMode={editMode}
        />
      )
    },
    [foods, showFoods, editMode],
  )

  return (
    <Background>
      {/* search bar */}
      <SearchBarForBookMark input={localSearchInputText} setInput={setLocalSearchInputText} placeholderText="料理名、食材を入力してください"></SearchBarForBookMark>
      {/* control bar */}
      <ControlBar
        favMode={favMode}
        setFavMode={favModeSwitch}
        editButtonPress={editModeSwitch}
      />
      {/* food cards */}
      <FavoriteFoodList
        foods={showFoods.length % 2 === 0 ? showFoods : [...showFoods, emptyFood]}
        onEndReached={() => { }}
        renderItem={renderItemFavoriteFood}
        listFooterComponent={() => {
          return <ListFooterComponent reachedEnd={true} reachedEndText={"You have reached the end of the foods list"} />
        }}
      />
      <Footer goBackFunc={() => navigation.goBack()} goNextFunc={() => console.log("no next step so far.")} skipFunc={() => { }} />
    </Background>
  );
};

export default FavoriteFoodScreen;

const styles = StyleSheet.create({
  // footer
  footerContainer: {
    width: windowWidth,
    height: windowHeight * 0.1,
    borderWidth: 1,
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
