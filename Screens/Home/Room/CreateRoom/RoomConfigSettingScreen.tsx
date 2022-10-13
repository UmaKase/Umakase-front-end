import { StyleSheet, Text } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../../../Types/Navigations/RoomStack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../../../Components/HomeDrawer/CustomHeader";
import { DrawerActions } from "@react-navigation/native";
import { backgroundColor, windowWidth } from "../../../../Constants/cssConst";
import { TouchableOpacity } from "react-native-gesture-handler";

type RoomConfigSettingScreeProps = NativeStackScreenProps<
  RoomStackNavigationProps,
  "RoomConfigSettingScreen"
>;
const RoomConfigSettingScreen: React.FC<RoomConfigSettingScreeProps> = ({
  navigation,
}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.background}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.openDrawer)}
        ></CustomHeader>
        {/* temp go back btn */}
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={{
            padding: windowWidth * 0.05,
            backgroundColor: "#77b",
            borderRadius: windowWidth * 0.02,
          }}
        >
          <Text>Go Back To Room List</Text>
        </TouchableOpacity>
        {/* start */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RoomConfigSettingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: "center",
  },
});
