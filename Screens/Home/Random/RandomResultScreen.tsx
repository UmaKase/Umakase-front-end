import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RandomStackNavigationProps } from "../../../Types/Navigations/HomeDrawer/RandomStack";

type RandomResultScreenProps = NativeStackScreenProps<
  RandomStackNavigationProps,
  "RandomResultScreen"
>;
const RandomResultScreen: React.FC<RandomResultScreenProps> = ({
  route,
  navigation,
}) => {
  // getting room id & name from the route
  const { roomId, roomName } = route.params;
  const randomFoodFunction = async () => {};
  return (
    <View>
      <Text>{roomId}</Text>
      <Text>{roomName}</Text>
    </View>
  );
};

export default RandomResultScreen;

const styles = StyleSheet.create({});
