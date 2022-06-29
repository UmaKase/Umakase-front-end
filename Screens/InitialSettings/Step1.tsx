import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = NativeStackScreenProps<InitialStepsProps, "Step1">;

const Step1: React.FC<Props> = ({ navigation, route }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <Text>this is step 1</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Step2")}>
          <Text style={{ backgroundColor: "#AAA" }}>skip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Step1;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
