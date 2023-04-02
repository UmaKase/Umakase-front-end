import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { darkerBackgroundColor } from "../../Constants/cssConst";

type AuthInputProps = {
  InputIcon: React.ReactNode;
  SetInputState: (val: string) => void;
  PlaceHolder: string;
  //PasswordMode switch
  PasswordMode: boolean;
  style?: StyleProp<ViewStyle>;
};

const AuthInput: React.FC<AuthInputProps> = ({
  InputIcon,
  SetInputState,
  PlaceHolder,
  PasswordMode,
  style,
}) => {
  //State of the TextInput secureTextEntry
  const [passInputSecure, setPassInputSecure] = useState(true);
  return (
    <View style={[styles.inputContainer, style]}>
      <View style={styles.inputIconContainer}>{InputIcon}</View>
      <TextInput
        onChangeText={(val) => SetInputState(val)}
        placeholder={PlaceHolder}
        placeholderTextColor={placeholderColor}
        style={styles.input}
        secureTextEntry={PasswordMode ? passInputSecure : false}
        autoCapitalize="none"
      />
      {PasswordMode ? (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPassInputSecure(!passInputSecure)}
        >
          <Icon.Ionicons
            name={passInputSecure ? "eye-off-outline" : "eye-outline"}
            size={inputIconSize}
            color="#FFF"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default AuthInput;

//getting the window width and height
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
//input layout params
const inputWidth = windowWidth * 0.85;
const inputHeight = windowHeight * 0.06;
const inputRadius = windowWidth * 0.025;
//fonts and icons size
const inputFontSize = windowWidth * 0.05;
const inputIconSize = windowWidth * 0.07;
//color
const inputBackgroundColor = "#171535";
// const inputBorderColor = "#45c1b9";
// const placeholderColor = "#477";
const inputBorderColor = "#FFF";
const placeholderColor = "#FFF";

const styles = StyleSheet.create({
  inputContainer: {
    width: inputWidth,
    height: inputHeight,
    backgroundColor: darkerBackgroundColor,
    opacity: 0.9,
    marginVertical: inputHeight / 3,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "row",
  },
  inputIconContainer: {
    width: inputWidth / 6,
    height: inputHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: inputHeight,
    borderRadius: inputRadius,
    color: "#FFF",
    fontSize: inputFontSize,
  },
  eyeIcon: {
    width: inputWidth / 6,
    height: inputHeight,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: inputRadius,
    borderBottomRightRadius: inputRadius,
  },
});
