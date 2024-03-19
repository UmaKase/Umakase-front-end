import React, { useEffect, useState } from "react";
import { BookmarkedStackProps } from "../../Types/Navigations/HomeDrawer/BookmarkedStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookmarkScreen from "../../Screens/Home/Bookmark/BookmarkScreen";
import FavoriteFoodScreen from "../../Screens/Home/Bookmark/FavoriteFoodScreen";
import SearchFoodTagScreen from "../../Screens/Home/Bookmark/SearchFoodTagScreen";
import { BookmarkContext } from "../../Context/BookmarkContext";
import SearchFoodResultScreen from "../../Screens/Home/Bookmark/SearchFoodResultScreen";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { DEFAULT_ROOM_ID_KEY } from "../../Constants/securestoreKey";
import customAxiosInstance from "../../Utils/customAxiosInstance";
import { RoomAPI } from "../../Constants/backendAPI";

// TagContext

const BookmarkedStack = createNativeStackNavigator<BookmarkedStackProps>();
const BookmarkedStackNavigation: React.FC = () => {
  const [reloadKEY, setReloadKEY] = useState<boolean>(false);
  const [bookmarkedFood, setBookmarkedFood] = useState<string[]>([]);

  //  set default room id if not exist
  async function settingDefaultRoomId(){
    try {
      const defultRoomId = await getItemAsync(DEFAULT_ROOM_ID_KEY);
      // if defaultRoomId not exist, set default room id
      if(!defultRoomId){
        const response = await customAxiosInstance({
          method: 'get',
          url: `${RoomAPI}/`,
        })
        if(response.data.data.rooms[0].room){
          await setItemAsync(DEFAULT_ROOM_ID_KEY, response.data.data.rooms[0].room.id);
          console.log('default room id set success:', response.data.data.rooms[0].room.id)
        }
      }
    } catch (error) {
      console.log('default room id set error:', error)
    }
  }

  useEffect(()=>{
    settingDefaultRoomId();
  }, [])


  return (
    <BookmarkContext.Provider
      value={{
        reloader:{
          favoriteFoodScreenReload_KEY: reloadKEY,
          setFavoriteFoodScreenReload_KEY: setReloadKEY,
        },
        bookmarkedFood: bookmarkedFood,
        setBookmarkedFood: setBookmarkedFood,
      }}
    >
      <BookmarkedStack.Navigator
        initialRouteName="BookmarkScreen"
        screenOptions={{ headerShown: false }}
      >
        <BookmarkedStack.Screen
          name="BookmarkScreen"
          component={BookmarkScreen}
        ></BookmarkedStack.Screen>
        <BookmarkedStack.Screen
          name="FavoriteFoodScreen"
          component={FavoriteFoodScreen}
        ></BookmarkedStack.Screen>
        <BookmarkedStack.Screen
          name="SearchFoodTagScreen"
          component={SearchFoodTagScreen}
        ></BookmarkedStack.Screen>
        <BookmarkedStack.Screen
          name="SearchFoodResultScreen"
          component={SearchFoodResultScreen}
        ></BookmarkedStack.Screen>
      </BookmarkedStack.Navigator>
    </BookmarkContext.Provider>
  );
};

export default BookmarkedStackNavigation;
