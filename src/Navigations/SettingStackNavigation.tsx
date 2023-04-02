import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingScreen from "../Screens/Home/Setting/SettingScreen";
import ReportScreen from "../Screens/Home/Setting/ReportScreen";
//Stack Navigation for profile screens
const SettingStack = createNativeStackNavigator();
export const SettingStackNavigation = () => (
  <SettingStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="SettingScreen"
  >
    <SettingStack.Screen
      name="SettingScreen"
      component={SettingScreen}
    ></SettingStack.Screen>
    <SettingStack.Screen
      name="ReportScreen"
      component={ReportScreen}
    ></SettingStack.Screen>
    {/* <SettingStack.Screen
      name="ProfileUpdateScreen"
      component={ProfileUpdateScreen}
    ></SettingStack.Screen> */}
  </SettingStack.Navigator>
);
