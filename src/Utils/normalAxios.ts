import axios from "axios";
import { Alert } from "react-native";
import { setItemAsync } from "expo-secure-store";
import { globalNavigationService, rootNavigationRef } from "../Ref";
import { INITIAL_STAGE_FOOD, INITIAL_STAGE_TAG } from "../Constants/securestoreKey";
import { CommonActions } from "@react-navigation/native";

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
        if (data.tagIds.length > 0 || data.selectedFoods.length > 0) {
          try {
            if(data.tagIds.length > 0){
              setItemAsync(INITIAL_STAGE_TAG, JSON.stringify(data.selectedTags));
            }
            if(data.foodIds.length > 0){
              setItemAsync(INITIAL_STAGE_FOOD, JSON.stringify(data.selectedFoods));
            }
            // auto reset the navigation stack to InitialStepsNavigation to prevent user from submitting the empty info form
            Alert.alert("ERROR", "Previous setting had been saved, information will inject automatically on next time open the app, you can close the app safely. :D", [
              {
                text: "OK",
                onPress: () => {
                  globalNavigationService("HomeStack")?.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [
                      { name: 'InitialStepsNavigation' },
                    ],
                  }))
                }
              }
            ])
          } catch (error) {
            console.log('normalAxios: error when saving data to secure store', error);
          }
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