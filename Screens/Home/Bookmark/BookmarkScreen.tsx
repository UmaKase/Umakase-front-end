import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookmarkedStackProps } from "../../../Types/Navigations/HomeDrawer/BookmarkedStack";
import Background from "../../../Components/Universal/Background";
import {
  darkerBackgroundColor,
  drawerColor,
  lightTextColor,
  windowHeight,
  windowWidth,
} from "../../../Constants/cssConst";
import MenuBlock from "../../../Components/Home/Bookmark/MenuBlock";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<BookmarkedStackProps, "BookmarkScreen">;
const BookmarkScreen: React.FC<Props> = ({ navigation, route }) => {
  return (
    <Background>
      <MenuBlock
        onPressHandler={() => navigation.navigate("FavoriteFoodScreen")}
        Icon={
          <FontAwesome5
            name="lemon"
            size={windowHeight * 0.06}
            color={lightTextColor}
          />
        }
        title="登録料理"
      ></MenuBlock>
      <MenuBlock
        onPressHandler={() => console.log("go room")}
        Icon={
          <MaterialCommunityIcons
            name="newspaper-variant-outline"
            size={windowHeight * 0.06}
            color={lightTextColor}
          />
        }
        title="登録レシピ"
      ></MenuBlock>
    </Background>
  );
};

export default BookmarkScreen;

const styles = StyleSheet.create({});
