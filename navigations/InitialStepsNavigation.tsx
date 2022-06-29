import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../Types/Navigations/InitialSteps";

//import screens
import Step1 from "../Screens/InitialSettings/Step1";
import Step2 from "../Screens/InitialSettings/Step2";

const InitialStepStack = createNativeStackNavigator<InitialStepsProps>();
const InitialStepsNavigation: React.FC = () => {
  return (
    <InitialStepStack.Navigator
      initialRouteName="Step1"
      screenOptions={{ headerShown: false }}
    >
      <InitialStepStack.Screen name="Step1" component={Step1} />
      <InitialStepStack.Screen name="Step2" component={Step2} />
    </InitialStepStack.Navigator>
  );
};
export default InitialStepsNavigation;
