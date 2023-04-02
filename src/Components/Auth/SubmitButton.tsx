import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import React from "react";
import {
  darkerBackgroundColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";

type SubmitButtonProps = {
  text: string;
  onPressHandler: () => void;
  style?: StyleProp<ViewStyle>;
};
const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  onPressHandler,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPressHandler} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    height: windowHeight * 0.06,
    width: windowWidth * 0.6,
    borderRadius: 15,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: windowWidth * 0.05,
    color: darkerBackgroundColor,
  },
});
