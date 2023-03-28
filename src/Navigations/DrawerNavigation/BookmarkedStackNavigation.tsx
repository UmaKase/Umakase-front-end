import React, { useState } from "react";
import { BookmarkedStackProps } from "../../Types/Navigations/HomeDrawer/BookmarkedStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookmarkScreen from "../../Screens/Home/Bookmark/BookmarkScreen";
import FavoriteFoodScreen from "../../Screens/Home/Bookmark/FavoriteFoodScreen";
import SearchFoodTagScreen from "../../Screens/Home/Bookmark/SearchFoodTagScreen";
import { TagContext } from "../../Context/TagContext";

// TagContext

const BookmarkedStack = createNativeStackNavigator<BookmarkedStackProps>();
const BookmarkedStackNavigation: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  return (
    <TagContext.Provider
      value={{ contextTags: selectedTags, setContextTags: setSelectedTags }}
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
      </BookmarkedStack.Navigator>
    </TagContext.Provider>
  );
};

export default BookmarkedStackNavigation;
