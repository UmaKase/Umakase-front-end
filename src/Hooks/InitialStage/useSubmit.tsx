import { CommonActions } from "@react-navigation/native";
import { setItemAsync } from "expo-secure-store";
import { useState } from "react";
import { AuthAPI } from "../../Constants/backendAPI";
import { ACCESS_KEY, CONFIG_KEY, REFRESH_KEY, TEMPUSERID_KEY, TEMPUSERPASS_KEY } from "../../Constants/securestoreKey";
import { globalNavigationService } from "../../Ref";
import { FoodCheck, TagCheck } from "../../Types/InitialSteps";
import normalAxios from "../../Utils/normalAxios";

type ReturnType = [
  submitStart:boolean,
  loadingText: "Creating new account" | "Login process",
  submit:({ selectedTagsId, foods, getSelectedFoods }: SubmitFunctionInput)=> Promise<void>
];

type SubmitFunctionInput = {
  selectedTags?: TagCheck[],
  selectedTagsId?:string[]
  foods?:FoodCheck[],
  getSelectedFoods?: ()=>FoodCheck[];
}

/**
 * @returns submitStart -  control submit mode
 * @returns loadingText - submit status text under ActivityIndicator
 * @returns submit - submit function to set at next button on selectFoodScreen
 */
export default function useSubmit():ReturnType{
  const [submitStart, setSubmitStart] = useState(false);
  const [loadingText, setLoadingText] = useState<"Creating new account"|"Login process">("Creating new account");

  /**
   * @param selectedTags - selected tags from selectTagScreen || set as [] if skip
   * @param selectedTagsId - tag id array from selectTagScreen || set as [] if skip
   * @param foods - foods state from useFoodFetch custom hook || set as [] if skip
   * @param getSelectedFoods - get selected foods from foodController.foods || set as [] if skip
   */
  async function submit({selectedTags, selectedTagsId, foods, getSelectedFoods}:SubmitFunctionInput){
    setSubmitStart(true);
    let tempData = undefined;
    // reset function
    // phase 1 register a temp user
    try {
      const response = await normalAxios({
        method: "post",
        url: `${AuthAPI}/register`,
        data: {
          isTemp: true,
          foodIds: foods !== undefined? [...foods.filter((food) => food.checked === true).map((food) => food.id)] : [],
          name: "__default",
          tagIds:selectedTagsId ?? [],
          selectedTags: selectedTags ?? [],
          selectedFoods: getSelectedFoods !== undefined? getSelectedFoods() : [],
        },
      });
      await setItemAsync(TEMPUSERID_KEY, response.data.data.tmpId);
      await setItemAsync(TEMPUSERPASS_KEY, response.data.data.tmpPass);
      tempData = {
        id: response.data.data.tmpId,
        pass: response.data.data.tmpPass,
      };
    } catch (error) {
      setSubmitStart(false);
      return console.log("Submit Error: Submit failed in phase 1");
    }
  
    // phase 2 login with temp user
    // prettier-ignore
    if(tempData === undefined){return console.log("Submit process failed with tempUserRegisterDate === undifined.")}
    setLoadingText("Login process");
    try {
      const res = await normalAxios({
        method: "post",
        url: `${AuthAPI}/login`,
        data: {
          username: tempData.id,
          password: tempData.pass,
        },
      });
      await setItemAsync(ACCESS_KEY, res.data.data.accessToken);
      await setItemAsync(REFRESH_KEY, res.data.data.refreshToken);
      await setItemAsync(CONFIG_KEY, "Completed");
      console.log("saved");
      globalNavigationService("HomeStack")?.dispatch(
        CommonActions.reset({
          routes: [{ name: "HomeDrawerNavigation" }],
        })
      );
    } catch (error) {
      setSubmitStart(false);
      return console.log("Submit Error: Submit failed in phase 2");
    }
  }

  return [submitStart, loadingText, submit];
};
