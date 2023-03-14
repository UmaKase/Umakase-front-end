import axios from "axios";
import { Alert } from "react-native";
import { setItemAsync } from "expo-secure-store";
import { rootNavigationRef } from "../Ref";
import { INITIAL_STAGE_FOOD, INITIAL_STAGE_TAG } from "../Constants/securestoreKey";

const normalAxios = axios.create();

normalAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // NOTE check if error is network error
    if (error.message === "Network Error") {
      // NOTE check if error.config has data & screen name is SelectFoodScreen
      if (error.config.data && rootNavigationRef.current?.getCurrentRoute()?.name == "SelectFoodScreen") {
        // change JSON to object
        const data = JSON.parse(error.config.data);
        // NOTE check if tagIds & foodIds array length > 0
        if (data.tagIds.length > 0 && data.foodIds.length > 0) {
          setItemAsync(INITIAL_STAGE_TAG, JSON.stringify(data.tagIds));
          setItemAsync(INITIAL_STAGE_FOOD, JSON.stringify(data.foodIds));
          Alert.alert("ERROR", "Previous setting had been saved, information will inject automatically on next time open the app, you can close the app safely. :D")
        } else {
          console.log("error: foodIds length is 0!")
        }
      } else {
        return Alert.alert("OOPS", "Bad network, try again later");
      }
    }
  }
)

export default normalAxios;