import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { Dimensions } from "react-native";
import {
  darkerBackgroundColor,
  paddingMedium,
  paddingSmall,
} from "../../Constants/cssConst";

type RegisterInputProps = {
  InputIcon: React.ReactNode;
  SetInputState: (val: string) => void;
  PlaceHolder: string;
  //PasswordMode switch
  PasswordMode: boolean;
  errMsg: string;
  errorShow: boolean;
  style?: StyleProp<ViewStyle>;
};

const RegisterInput: React.FC<RegisterInputProps> = ({
  InputIcon,
  SetInputState,
  PlaceHolder,
  PasswordMode,
  errMsg,
  errorShow,
  style,
}) => {
  //State of the TextInput secureTextEntry
  const [passInputSecure, setPassInputSecure] = useState(true);
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.errorMsgContainer}>
        {errorShow ? <Text style={[styles.errorMsg]}>{errMsg}</Text> : <></>}
      </View>
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
    </View>
  );
};
export default RegisterInput;

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
const placeholderColor = "#FFF";

const styles = StyleSheet.create({
  backgroundContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorMsgContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    height: 18,
    marginBottom: paddingMedium,
  },
  errorMsg: {
    color: "red",
    fontSize: 15,
  },
  inputContainer: {
    width: inputWidth,
    height: inputHeight,
    backgroundColor: darkerBackgroundColor,
    opacity: 0.9,
    marginBottom: inputHeight / 8,
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
