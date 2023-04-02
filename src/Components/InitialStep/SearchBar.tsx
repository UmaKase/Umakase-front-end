import { StyleSheet, TextInput, View } from "react-native";
import React, { useEffect, useRef } from "react";
import {
  windowWidth,
  windowHeight,
  drawerColor,
  backgroundColor,
} from "../../Constants/cssConst";

type Props = {
  placeholderText: string;
  input: string;
  setInput: (value: React.SetStateAction<string>) => void;
  searchFunction: (value: string) => void;
};

const SearchBar: React.FC<Props> = ({
  input,
  setInput,
  placeholderText,
  searchFunction,
}) => {
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if(textInputRef.current !== null){
      setTimeout(()=>{textInputRef.current!.focus();}, 40)
    }
  }, [textInputRef.current])
  
  return (
    <View style={styles.searchbarContainer}>
      <TextInput
        ref={textInputRef}
        style={styles.searchbar}
        value={input}
        onChangeText={(newText) => {
          setInput(newText);
          searchFunction(newText);
        }}
        placeholder={placeholderText}
        placeholderTextColor={drawerColor}
        autoCapitalize="none"
        selectionColor={backgroundColor}
      ></TextInput>
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
    marginTop: windowHeight * 0.02,
  },
  searchbar: {
    flex: 0.9,
    fontSize: windowWidth * 0.06,
    color: backgroundColor,
    borderBottomWidth: 1,
    borderColor: drawerColor,
  },
});
