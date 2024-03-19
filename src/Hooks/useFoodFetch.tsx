// official const & function & types
import { useState, useEffect } from 'react';
import { getItemAsync } from 'expo-secure-store';
// custom const & function & types
import normalAxios from '../Utils/normalAxios';
import { FoodAPI } from '../Constants/backendAPI';
import { FoodCheck } from '../Types/InitialSteps';
import { INITIAL_STAGE_FOOD } from '../Constants/securestoreKey';

type UseFoodFetchResponse = [
  foodsController: {
    foods: FoodCheck[],
    setFoods: React.Dispatch<React.SetStateAction<FoodCheck[]>>,
    getSelectedFoods: () => FoodCheck[],
    foodPageAdd: () => void,
    foodListEnd: boolean,
    selectAllFood: boolean,
    setSelectAllFood: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectAllFoodSwitcher: React.Dispatch<React.SetStateAction<boolean>>,
  }
];

export default function useFoodFetch(selectAllTag: boolean, tags?: string[], foodName?: string, bookmarkFood?: string[]): UseFoodFetchResponse {
  // SECTION States
  // first loading flag
  const [firstLoading, setFirstLoading] = useState(true);
  // NOTE foods => foods array with checked value
  const [foods, setFoods] = useState<FoodCheck[]>([]);
  // NOTE page => to control which page of the API pagination currently on
  const [page, setPage] = useState(1);
  // NOTE foodListEnd => switch for check if the end of the API pagination is reached
  const [foodListEnd, setFoodListEnd] = useState(false);
  // select all food flag
  const [selectAllFood, setSelectAllFood] = useState(false);
  // select all food switcher
  const [selectAllFoodSwitcher, setSelectAllFoodSwitcher] = useState(false);
  // !SECTION

  // SECTION First loading check prev foods function
  async function firstLoadingCheck() {
    // NOTE getting prev setting foods
    const prevFoodsJSON = await getItemAsync(INITIAL_STAGE_FOOD);
    // NOTE if prevFoodsJSON not null then set JSON.parse(prevFoodsJSON) to foods state
    if (prevFoodsJSON && firstLoading) {
      setFoods((prev) => [...prev, ...JSON.parse(prevFoodsJSON)]);
    }
    setFirstLoading(false);
  }
  // !SECTION

  //SECTION fetch food data function
  async function fetchFoodData() {
    console.log(selectAllTag);
    try {
      // NOTE call fetch API
      const response = await normalAxios({
        method: 'post',
        url: `${FoodAPI}/db?take=20&page=${page}`,
        data: {
          tagIds: selectAllTag ? [] : tags,
          excludeFoods: bookmarkFood ?? foods.map((food) => food.id),
        }
      });
      console.log('123:', response.data.data);
      //NOTE check if there is still any food in fetch data, if not just setFoodListEnd to true
      if (response.data.data.foods.length > 0) {
        //NOTE break down food from api and add property checked into it
        const preProcessResponse: FoodCheck[] = response.data.data.foods.map((foodData: FoodCheck) => {
          foodData.checked = selectAllFood;
          return foodData;
        });
        setFoods((prev) => [...prev, ...preProcessResponse]);
        // NOTE if response.data.data.foods.length <= 0, then set food list end to true
      } else {
        setFoodListEnd(true);
      }
    } catch (error) {
      console.log("useFoodFetch:", error)
    }
  };
  // !SECTION

  // NOTE Getting selected food
  function getSelectedFoods() {
    const selectedFoods = foods.filter((food) => food.checked === true);
    return selectedFoods;
  }

  function foodPageAdd() {
    setPage(prev => prev + 1);
  }

  //ANCHOR initial fetch foods data, trigger is when page change.
  useEffect(() => {
    // if there is prev foods setting set it into array
    if (firstLoading) {
      firstLoadingCheck();
      //NOTE check is foodListEnd is true, if not keep fetching data into foods array
    } else if (!foodListEnd && !firstLoading) {
      fetchFoodData();
    } else {
      console.log(`firstLoading: ${firstLoading}, foodListEnd: ${foodListEnd}, reached the end of the food list`);
    }
  }, [page, firstLoading]);

  // switcher for select all food
  useEffect(() => {
    setFoods((prev) => prev.map((food) => {
      food.checked = selectAllFood;
      return food;
    }));
  }, [selectAllFoodSwitcher])

  // monitor foods state change to update select all food switcher
  useEffect(() => {
    if (foods.length > 0) {
      const allSelected = foods.every((food) => food.checked === true);
      setSelectAllFood(allSelected);
    }
  }, [foods])

  // wrap state and function with 
  const foodsController = {
    foods: foods,
    setFoods: setFoods,
    getSelectedFoods: getSelectedFoods,
    foodPageAdd: foodPageAdd,
    foodListEnd: foodListEnd,
    selectAllFood: selectAllFood,
    setSelectAllFood: setSelectAllFood,
    setSelectAllFoodSwitcher: setSelectAllFoodSwitcher,
  }


  return [foodsController];
}