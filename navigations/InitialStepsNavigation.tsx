import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../Types/Navigations/InitialSteps";

//import screens
import SelectTagScreen from "../Screens/InitialSettings/SelectTagScreen";
import SelectFoodScreen from "../Screens/InitialSettings/SelectFoodScreen";
import IntroScreen from "../Screens/InitialSettings/IntroScreen";

const InitialStepStack = createNativeStackNavigator<InitialStepsProps>();
const InitialStepsNavigation: React.FC = () => {
  return (
    <InitialStepStack.Navigator
      initialRouteName="IntroScreen"
      screenOptions={{ headerShown: false }}
    >
      <InitialStepStack.Screen name="IntroScreen" component={IntroScreen} />
      <InitialStepStack.Screen
        name="SelectTagScreen"
        component={SelectTagScreen}
      />
      <InitialStepStack.Screen
        name="SelectFoodScreen"
        component={SelectFoodScreen}
      />
    </InitialStepStack.Navigator>
  );
};
export default InitialStepsNavigation;
