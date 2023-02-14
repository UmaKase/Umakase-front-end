import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../Screens/Home/ProfileScreen";
import ProfileUpdateScreen from "../Screens/Home/ProfileUpdateScreen";
import LoginScreen from "../Screens/Merge/LoginScreen";
import RegisterScreen from "../Screens/Merge/RegisterScreen";
//Stack Navigation for profile screens
const ProfileStack = createNativeStackNavigator();
export const ProfileStackNavigation = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="ProfileScreen"
  >
    <ProfileStack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
    ></ProfileStack.Screen>
    <ProfileStack.Screen
      name="ProfileUpdateScreen"
      component={ProfileUpdateScreen}
    ></ProfileStack.Screen>
    <ProfileStack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
    ></ProfileStack.Screen>
    <ProfileStack.Screen
      name="LoginScreen"
      component={LoginScreen}
    ></ProfileStack.Screen>
  </ProfileStack.Navigator>
);
