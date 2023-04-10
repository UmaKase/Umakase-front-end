import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { backgroundColor } from "../../Constants/cssConst";
import CustomHeader from "../HomeDrawer/CustomHeader";
import { DrawerActions, useNavigation } from "@react-navigation/native";

type Props = {
  children?: React.ReactNode;
  headerOption?: boolean;
};
const Background: React.FC<Props> = ({ children, headerOption = true }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
        {headerOption ? (
          <CustomHeader
            toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ) : null}
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Background;

const styles = StyleSheet.create({});
