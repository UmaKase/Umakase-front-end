import { createContext } from "react";
type BookmarkContextProps = {
  reloader:{
    favoriteFoodScreenReload_KEY: boolean;
    setFavoriteFoodScreenReload_KEY: React.Dispatch<React.SetStateAction<boolean>>;
  },
  bookmarkedFood: string[];
  setBookmarkedFood: React.Dispatch<React.SetStateAction<string[]>>;
};

export const BookmarkContext = createContext<BookmarkContextProps>({
  reloader:{
    favoriteFoodScreenReload_KEY: false,
    setFavoriteFoodScreenReload_KEY: ()=>{},
  },
  bookmarkedFood: [],
  setBookmarkedFood: ()=>{},
});
