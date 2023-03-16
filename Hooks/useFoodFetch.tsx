// official const & function & types
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {getItemAsync} from 'expo-secure-store';
// custom const & function & types
import normalAxios from '../Utils/normalAxios';
import { FoodAPI } from '../Constants/backendAPI';
import {FoodCheck } from '../Types/InitialSteps';
import { INITIAL_STAGE_FOOD } from '../Constants/securestoreKey';

type UseFoodFetchResponse = [
  foods: FoodCheck[],
  setFoods: React.Dispatch<React.SetStateAction<FoodCheck[]>>,
  setPage: React.Dispatch<React.SetStateAction<number>>
];

export default function useFoodFetch(tags: string[]): UseFoodFetchResponse {
  // SECTION States
  // NOTE foods => foods array with checked value
  const [foods, setFoods] = useState<FoodCheck[]>([]);
  // NOTE page => to control which page of the API pagination currently on
  const [page, setPage] = useState(1);
  // NOTE foodListEnd => switch for check if the end of the API pagination is reached
  const [foodListEnd, setFoodListEnd] = useState(false);
  // !SECTION

  //SECTION fetch food data function
  const fetchFoodData = async () => {
    const initialStageFood = await getItemAsync(INITIAL_STAGE_FOOD);
    try {
      const response = await normalAxios({
        method:'post',
        url: `${FoodAPI}/db?take=20&page=${page}`,
        data:{
            tagIds: tags,
            excludeFoods: foods.map((food) => food.id),
        }
      });
      //NOTE check if there is still any food in fetch data, if not just setFoodListEnd to true
      if(response.data.data.foods.length > 0){
        //NOTE break down food from api and add property checked into it
        setFoods((prev)=>{
          // process data fetch from server
          prev = [
            ...prev, 
            ...response.data.data.foods.map((foodData:FoodCheck)=>{
              foodData.checked = false;
              return foodData;
            }),
          ]
          //NOTE Check if user have initialStageFood in first fetch
          if(page === 1 && typeof initialStageFood === 'string'){
            // NOTE Change JSON into object
            const chosenFood:string[] = JSON.parse(initialStageFood);
            // NOTE iterate over the array to check if the food is already in the chosenFood 
            prev = prev.map((food)=>{
              if(chosenFood.includes(food.id)){
                food = {...food, checked: true}
              }
              return food
            })
          }
          return prev
        })
      }else{
        setFoodListEnd(true);
        return Alert.alert("You have reached the end of the list.");
      }
    } catch (error) {
      console.log("useFoodFetch:",error)
    }
  };
  // !SECTION

  //ANCHOR initial fetch foods data, trigger is when page change.
  useEffect(() => {
    //NOTE check is foodListEnd is true, if not keep fetching data into foods array
    if(!foodListEnd){
      fetchFoodData();
    }else{
      return Alert.alert("You have reached the end of the foods list.");
    }
  }, [page]);


  return [ foods, setFoods, setPage ];
}