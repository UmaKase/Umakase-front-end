import { FoodAPI } from "../../Constants/backendAPI";
import { useEffect, useMemo, useState } from "react";
import { FavoriteFoodInterface } from "../../Types/InitialSteps";
import customAxiosInstance from "../../Utils/customAxiosInstance";

type useFavoriteFoodFetchReturnType = [
  foods: FavoriteFoodInterface[],
  setFoods: React.Dispatch<React.SetStateAction<FavoriteFoodInterface[]>>,
  showFoods: FavoriteFoodInterface[],
  searchInputText: string,
  setSearchInputText: React.Dispatch<React.SetStateAction<string>>,
  tag: string[],
  setTags: React.Dispatch<React.SetStateAction<string[]>>,
  favMode: boolean,
  favModeSwitch: () => void,
  editMode: boolean,
  editModeSwitch: () => void,
  fetching: boolean,
  reFetchFoods: () => void,
]
export default function useFavoriteFoodFetch(): useFavoriteFoodFetchReturnType {
  const [fetching, setFetching] = useState<boolean>(true);
  const [foods, setFoods] = useState<FavoriteFoodInterface[]>([]);
  const [localSearchInputText, setLocalSearchInputText] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [favMode, setFavMode] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const showFoods: FavoriteFoodInterface[] = useMemo(() => {
    // if in favorite mode
    if (favMode) {
      if (localSearchInputText !== "") {
        return foods.filter((item) => {
          if (item.food.name.includes(localSearchInputText) && item.isFavorite) {
            return item;
          }
          return;
        });
      }
      return foods.filter((item) => {
        if (item.isFavorite) {
          return item;
        }
        return;
      });
      // if not in favorite mode
    } else {
      if (localSearchInputText !== "") {
        return foods.filter((item) => {
          if (item.food.name.includes(localSearchInputText)) {
            return item;
          }
          return;
        });
      }
      return foods;
    }
  }, [foods, localSearchInputText, favMode, editMode])

  // fetch the favorite foods from the backend
  const fetchFavoriteFoods = async () => {
    try {
      const response = await customAxiosInstance.get(`${FoodAPI}/default`);
      console.log('testing data:', response.data.data.foods[0]);
      setFoods(response.data.data.foods);
      setTags(response.data.data.tags);
    } catch (error) {
      console.log('error from fetchFavoriteFoods:', error);
    } finally {
      setFetching(false);
    }
  };


  useEffect(() => {
    if (fetching) {
      fetchFavoriteFoods();
    }
  }, [fetching])

  // wrap function
  const reFetchFoods = () => {
    setLocalSearchInputText("");
    setFavMode(false);
    setFetching(true);
  }

  const favModeSwitch = () => {
    setLocalSearchInputText("");
    setFavMode(prev => !prev)
  };

  const editModeSwitch = () => {
    setEditMode(prev => !prev);
  }

  // return the states and functions
  return [ foods, setFoods, showFoods, localSearchInputText, setLocalSearchInputText, tags, setTags, favMode, favModeSwitch, editMode, editModeSwitch, fetching, reFetchFoods ];
}
