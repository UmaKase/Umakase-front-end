import axios from "axios";
import { Alert } from "react-native";
import { setItemAsync } from "expo-secure-store";
import { navigationRef } from "../Ref";
import { INITIAL_STAGE_DATA } from "../Constants/securestoreKey";

const normalAxios = axios.create();

normalAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // check if error is network error
    if (error.message === "Network Error") {
      // check if error.config has data & screen name is SelectFoodScreen
      if (error.config.data && navigationRef.current?.getCurrentRoute()?.name == "SelectFoodScreen") {
        const data = JSON.parse(error.config.data);
        // check if foodIds array length > 0
        if (data.foodIds.length > 0) {
          // save foodIds array as string into secureStore
          setItemAsync("INITIAL_STAGE_FOODS", JSON.stringify(data.foodIds));
          Alert.alert(INITIAL_STAGE_DATA, "Previous setting had been saved, information will inject automatically on next time open the app, you can close the app safely. :D")
        } else {
          console.log("error: foodIds length is 0!")
        }
      } else {
        return Alert.alert("OOPS", "Bad network, try again later");
      }
    }
  }
)

export default normalAxios