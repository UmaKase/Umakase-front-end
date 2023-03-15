// official const & function & types
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
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
    debounceSearchFoodFunction: _.DebouncedFunc<(userInput:string) => void>;
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