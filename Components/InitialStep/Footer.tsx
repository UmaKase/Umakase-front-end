import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";

type Props = {
  goBackFunc: () => void;
  goNextFunc: () => void;
  skipFunc: () => void;
};

const Footer: React.FC<Props> = ({ goBackFunc, goNextFunc, skipFunc }) => {
  return (
    <View style={styles.footer}>
      <View style={styles.sideContainer}>
        <TouchableOpacity onPress={() => goBackFunc()}>
          <FontAwesome
            name="arrow-circle-left"
            size={windowWidth * 0.145}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.skipBtn} onPress={() => skipFunc()}>
          <Text style={styles.skipBtnText}>スキップ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sideContainer}>
        <TouchableOpacity onPress={() => goNextFunc()}>
          <FontAwesome
            name="arrow-circle-right"
            size={windowWidth * 0.145}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    height: windowHeight * 0.08,
    width: windowWidth,
    flexDirection: "row",
  },
  sideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  btnContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  skipBtn: {
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    borderRadius: windowWidth * 0.04,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  skipBtnText: {
    fontSize: windowWidth * 0.05,
    color: backgroundColor,
  },
});
