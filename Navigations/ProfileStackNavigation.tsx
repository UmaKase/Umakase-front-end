import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackProps } from "../Types/Home/Profile/ProfileStackProps";
import ProfileScreen from "../Screens/Home/ProfileScreen";
import ProfileUpdateScreen from "../Screens/Home/ProfileUpdateScreen";
import LoginScreen from "../Screens/Merge/LoginScreen";
import RegisterScreen from "../Screens/Merge/RegisterScreen";
//Stack Navigation for profile screens

const ProfileStack = createNativeStackNavigator<ProfileStackProps>();
const ProfileStackNavigation: React.FC = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{ headerShown: false }}
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
};

export default ProfileStackNavigation;
