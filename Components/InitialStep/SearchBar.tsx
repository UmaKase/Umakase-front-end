import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  windowWidth,
  windowHeight,
  drawerColor,
} from "../../Constants/cssConst";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  placeholderText: string;
  input: string;
  setInput: (value: React.SetStateAction<string>) => void;
  searchFunction: (value: string) => void;
  searchBtnFunc: () => void;
};

const SearchBar: React.FC<Props> = ({
  input,
  setInput,
  placeholderText,
  searchFunction,
  searchBtnFunc,
}) => {
  return (
    <View style={styles.searchbarContainer}>
      <TextInput
        style={styles.searchbar}
        value={input}
        onChangeText={(newText) => {
          setInput(newText);
          searchFunction(newText);
        }}
        placeholder={placeholderText}
        placeholderTextColor={drawerColor}
        autoCapitalize="none"
        // caretHidden={true}
        selectionColor="#FFF"
      ></TextInput>
      <View style={styles.searchBtn}>
        <TouchableOpacity onPress={() => searchBtnFunc()}>
          <FontAwesome name="search" size={windowWidth * 0.07} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchbarContainer: {
    width: windowWidth,
    height: windowHeight * 0.06,
    flexDirection: "row",
    paddingLeft: windowWidth * 0.1,
    paddingRight: windowWidth * 0.05,
  },
  searchbar: {
    flex: 5,
    fontSize: windowWidth * 0.065,
    color: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#FFF",
  },
  searchBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
