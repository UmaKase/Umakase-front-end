import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI } from "../../Constants/backendAPI";
import { HomeTabNavigationProps } from "../../types/Navigations/HomeTab";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY, REFRESH_KEY } from "../../Constants/securestoreKey";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import { backgroundColor } from "../../Constants/cssConst";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { HomeDrawerNavigationProps } from "../../types/Navigations/HomeDrawer";

type RandomScreenProps = DrawerScreenProps<
  HomeDrawerNavigationProps,
  "ProfileScreen"
>;

const ProfileScreen: React.FC<RandomScreenProps> = ({ navigation, route }) => {
  //logout process
  const logoutProcess = async () => {
    const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!localRefreshToken) {
      console.log("No local refresh token");
      return Alert.alert("Error", "No local refresh token");
    }
    axios({
      method: "post",
      url: `${AuthAPI}/token/logout`,
      headers: { Authorization: `Bearer ${localRefreshToken}` },
    }).then(async (response) => {
      if (response.status) {
        await SecureStore.deleteItemAsync(ACCESS_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        navigation.dispatch(
          CommonActions.reset({ routes: [{ name: "AuthNavigation" }] })
        );
      } else {
        return Alert.alert("Error", "logout process failed.");
      }
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.background}>
          <CustomHeader
            toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          ></CustomHeader>
          <TouchableOpacity
            onPress={() => logoutProcess()}
            style={styles.logoutBtn}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtn: {
    backgroundColor: "#888",
  },
});
