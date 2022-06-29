import React from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { CONFIG_KEY } from "../../Constants/securestoreKey";

type Props = NativeStackScreenProps<InitialStepsProps, "Step2">;

const Step2: React.FC<Props> = ({ navigation, route }) => {
  const settingComplete = async () => {
    await SecureStore.setItemAsync(CONFIG_KEY, "Completed");
    console.log("saved");
    navigation.dispatch(
      CommonActions.reset({ routes: [{ name: "HomeTabNavigation" }] })
    );
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <Text>This is step 2</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ backgroundColor: "#777" }}>go back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => settingComplete()}>
          <Text style={{ backgroundColor: "#AAA" }}>skip2</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Step2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
