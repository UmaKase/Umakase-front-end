import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import {
  drawerColor,
  backgroundColor,
  windowWidth,
  windowHeight,
  darkerBackgroundColor,
  lightTextColor,
  paddingMedium,
  textMedium,
} from "../../../Constants/cssConst";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  placeholderText: string;
  input: string;
  setInput: (value: React.SetStateAction<string>) => void;
  searchFunction: (value: string) => void;
};
const SearchBarForBookMark: React.FC<Props> = ({
  input,
  setInput,
  placeholderText,
  searchFunction,
}) => {
  return (
    <View style={styles.searchbarContainer}>
      <TextInput
        style={styles.searchbar}
        value={input}
        autoFocus={false}
        onChangeText={(newText) => {
          setInput(newText);
          searchFunction(newText);
        }}
        placeholder={placeholderText}
        placeholderTextColor="#E7E7E7"
        autoCapitalize="none"
        selectionColor={backgroundColor}
      ></TextInput>
      <FontAwesome name="search" size={windowWidth * 0.07} color="#FFF" />
    </View>
  );
};

export default SearchBarForBookMark;

const styles = StyleSheet.create({
  searchbarContainer: {
    width: windowWidth * 0.88,
    height: windowHeight * 0.06,
    marginRight: "auto",
    marginLeft: "auto",
    flexDirection: "row",
    paddingLeft: paddingMedium,
    paddingRight: paddingMedium,
    marginTop: windowHeight * 0.02,
    backgroundColor: darkerBackgroundColor,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  searchbar: {
    flex: 1,
    fontSize: textMedium,
    color: lightTextColor,
  },
});
