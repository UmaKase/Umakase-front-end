// official const & function & types
import { useCallback, useEffect, useState } from "react";
import { debounce, DebouncedFunc } from "lodash";
// custom const & function & types
import normalAxios from "../Utils/normalAxios";
import { FoodAPI } from "../Constants/backendAPI";
import { FoodCheck } from "../Types/InitialSteps";

type UseSearchFoodFetchResponse = [
  searchModeController: {
    searchMode:boolean,
    startSearchMode: ()=>void;
    endSearchMode: ()=>void;
  },
  searchActionController:{
    searchFoods: FoodCheck[],
    setSearchFoods: React.Dispatch<React.SetStateAction<FoodCheck[]>>
    input:string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    debounceSearchFoodFunction: DebouncedFunc<(userInput:string) => void>;
    pageAdd: ()=> void;
  },
];

/**
 *  - Controller of search food modal action
 *  @param {boolean} searchMode => control modal is show or not,
 *  @param {()=>void} startSearchMode => function to show modal
 *  @param {()=>void} endSearchMode => function to hide modal and initialize params
 * ---------------------------------------------------------------------------------
 *  - Controller of search food fetch function
 *  @param {FoodCheck} searchFood - search foods array state
 *  @param {React.Dispatch<React.SetStateAction<FoodCheck[]>>} setSearchFoods - set search Foods
 *  @param {string} input - search bar TextInput state
 *  @param {React.Dispatch<React.SetStateAction<string>>} setInput - search bar add to TextInput onTextChange action to update input
 *  @param {DebouncedFunc<(userInput: string)=>void>} debounceSearchFoodFunction - Debounce function for TextInput onTextChange action
 *  @param {()=>void} pageAdd - FlatList onEndReached Handler add a new page will trigger next page api request
 */
export default function useSearchFoodFetch(foods:FoodCheck[]): UseSearchFoodFetchResponse {
  // SECTION State 
  // decide modal be show or not, also control the reset mechanism
  const [searchMode, setSearchMode] = useState(false);
  // foods array with checked value
  const [searchFoods, setSearchFoods] = useState<FoodCheck[]>([]);
  // text input for InputText component
  const [input, setInput] = useState<string>("");
  // control which page of the API pagination currently on
  const [page, setPage] = useState(1);
  // a switch to check if the end of the API pagination is reached
  const [searchFoodListEnd, setSearchFoodListEnd] = useState(false);
  // !SECTION

  // SECTION Fetch search food data
  async function fetchData(userInput?:string){
    try {
      const response = await normalAxios({
        method:'post',
        url: `${FoodAPI}/db?name=${userInput?? input}&take=20&page=${page}`,
        data: {
          excludeFoods: [],
        }
      })

      // check if there is still any foods in the response if not set the end of the list to true
      if(response.data.data.foods.length <= 0){
        setSearchFoodListEnd(true);
        return;
      }

      // NOTE preprocess food data to add checked value and set to searchFoods State
      const preProcessResponse = response.data.data.foods.map((sFood:FoodCheck)=>{
        const foodAlreadyInList = foods.find((food)=>food.id === sFood.id);
        sFood.checked = foodAlreadyInList?.checked ?? false;
        return sFood;
      });

      // NOTE combine the new response with the previous state
      setSearchFoods((prev)=>{
        const newState = [...prev, ...preProcessResponse];
        return newState;
      })
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
      setSearchFoods([]);
      setSearchFoodListEnd(false);
      // NOTE check if input have value before fetch data
      if (userInput !== "") {
        fetchData(userInput);
      }
    }, 1000),
    [foods],
  );
  // !SECTION

  // ANCHOR useEffect trigger when the page is changed, and do nothing when pagination reached end
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
    searchMode: searchMode,
    startSearchMode: startSearchMode,
    endSearchMode: endSearchMode,
  }

  // NOTE controller of data of search foods
  const searchFoodsController = {
    searchFoods: searchFoods,
    input: input,
    setInput: setInput,
    setSearchFoods: setSearchFoods,
    debounceSearchFoodFunction: debounceSearchFoodFunction,
    pageAdd: pageAdd,
  }
  // !SECTION


  return [ searchModeController, searchFoodsController];
}