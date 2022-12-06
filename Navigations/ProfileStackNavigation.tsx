import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../Screens/Home/ProfileScreen";
import ProfileUpdateScreen from "../Screens/Home/ProfileUpdateScreen";
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
  </ProfileStack.Navigator>
);
