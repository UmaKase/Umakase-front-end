import axios from "axios";
import { Alert } from "react-native";
import { setItemAsync } from "expo-secure-store";
import { rootNavigationRef } from "../Ref";
import { INITIAL_STAGE_FOOD, INITIAL_STAGE_TAG } from "../Constants/securestoreKey";
import { errorPopUp } from "../Components/Universal/AlertControl";

const normalAxios = axios.create();

normalAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // NOTE check if error is network error
    if (error.message === "Network Error") {
      // NOTE check if error.config has data & screen name is SelectFoodScreen
      if (error.config.data && rootNavigationRef.current?.getCurrentRoute()?.name == "SelectFoodScreen") {
        // change JSON to object
        const data = JSON.parse(error.config.data);
        // NOTE check if tagIds & foodIds array length > 0
        if (data.tagIds.length > 0 || data.selectedFoods.length > 0) {
          if (data.tagIds.length > 0) {
            setItemAsync(INITIAL_STAGE_TAG, JSON.stringify(data.selectedTags));
          }
          if (data.foodIds.length > 0) {
            setItemAsync(INITIAL_STAGE_FOOD, JSON.stringify(data.selectedFoods));
          }
          errorPopUp("E0119");
        } else {
          console.log("error: foodIds length is 0!");
        }
      } else {
        return errorPopUp("E0120");
      }
    }
  }
);

export default normalAxios;
