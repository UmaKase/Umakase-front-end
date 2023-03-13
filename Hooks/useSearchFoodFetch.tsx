// official const & function & types
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { debounce } from "lodash";
// custom const & function & types
import normalAxios from "../Utils/normalAxios";
import { FoodAPI } from "../Constants/backendAPI";
import { FoodCheck } from "../Types/InitialSteps";

type UseSearchFoodFetchResponse = [
  searchFoods: FoodCheck[],
  searchMode:boolean,
  input:string,
  searchModeController: {
    startSearchMode: ()=>void;
    endSearchMode: ()=>void;
  },
  searchActionController:{
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setSearchFoods: React.Dispatch<React.SetStateAction<FoodCheck[]>>
    debounceSearchFoodFunction: _.DebouncedFunc<(userInput:string) => void>;
    pageAdd: ()=> void;
  },
];

export default function useSearchFoodFetch(foods:FoodCheck[]): UseSearchFoodFetchResponse {
  // SECTION State 
  // NOTE decide modal be show or not, also control the reset mechanism
  const [searchMode, setSearchMode] = useState(false);
  // NOTE foods array with checked value
  const [searchFoods, setSearchFoods] = useState<FoodCheck[]>([]);
  // NOTE text input for InputText component
  const [input, setInput] = useState<string>("");
  // NOTE control which page of the API pagination currently on
  const [page, setPage] = useState(1);
  // NOTE a switch to check if the end of the API pagination is reached
  const [searchFoodListEnd, setSearchFoodListEnd] = useState(false);
  // !SECTION

  // SECTION Fetch search food data
  async function fetchData(userInput?:string){
    console.log("this page is:", page);
    try {
      const response = await normalAxios({
        method:'post',
        url: `${FoodAPI}/db?name=${userInput?? input}&take=20&page=${page}`,
        data: {
          excludeFoods: foods.map((food) => food.id),
        }
      })
      // check if there is still any foods in the response
      if(response.data.data.foods.length > 0){
        // NOTE preprocess food data to add checked value and set to searchFoods State
        setSearchFoods((prev)=>{
          // process foods from response add checked with default value false
          prev = [...prev, ...response.data.data.foods.map((food:FoodCheck)=>{
            food.checked = false;
            return food
          })]
          return prev
        })
      }else{
        setSearchFoodListEnd(true);
        return Alert.alert("You have reached the end of the list.");
      }
    } catch (error) {
      console.log("useSearchFoodFetch:",error)
    }
  }
  // !SECTION

  // SECTION Debounce search food function implement to text input object to let it trigger by onTextChange event
  const debounceSearchFoodFunction = useCallback(
    debounce((userInput:string) => {
      // reset page and end flag
      setPage(1);
      setSearchFoodListEnd(false);
      // NOTE check if input is empty string set searchFoods to [] and page to 1
      if (userInput === "") {
        setSearchFoods([]);
        setPage(1);
        // NOTE fetch data
      } else{
        console.log("fetch!!")
        fetchData(userInput);
      }
    }, 500),
    [],
  );
  // !SECTION

  // ANCHOR trigger when the page is changed, and do nothing when pagination reached end
  useEffect(() => {
    if(page !== 1 && !searchFoodListEnd){
      fetchData();
    }
  }, [page])

  // SECTION Wrap up setState into function
  // NOTE make page +1 to trigger the useEffect in order to add more foods in the end of the list
  function pageAdd(){
    setPage(prev=>prev+1);
  }

  // NOTE function turn modal visible to true
  function startSearchMode(){
    setSearchMode(true);
  }

  // NOTE function turn modal visible to false and reset all params
  function endSearchMode(){
    setSearchMode(false);
    setInput("");
    setSearchFoods([]);
    setPage(1);
  }
  // !SECTION

  // SECTION Set functions into object to organize output
  // NOTE controller of modal action
  const searchModeController = {
    startSearchMode: startSearchMode,
    endSearchMode: endSearchMode,
  }

  // NOTE controller of data of search foods
  const searchFoodsController = {
    setInput: setInput,
    setSearchFoods: setSearchFoods,
    debounceSearchFoodFunction: debounceSearchFoodFunction,
    pageAdd: pageAdd,
  }
  // !SECTION

  return [searchFoods, searchMode, input, searchModeController, searchFoodsController];
}