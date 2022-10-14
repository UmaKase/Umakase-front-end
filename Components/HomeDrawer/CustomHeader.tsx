import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { lightTextColor, windowWidth } from "../../Constants/cssConst";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

interface CustomHeaderProps {
  toggleMenu: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ toggleMenu }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => toggleMenu()}>
          <FontAwesome name="bars" size={30} color={lightTextColor} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => Alert.alert("notification", "this is on todo list.")}
        >
          <FontAwesome name="bell" size={30} color={lightTextColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    // right: 0,
    // top: 0,
    width: windowWidth,
    height: 35,
    flexDirection: "row",
    paddingHorizontal: windowWidth * 0.03,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
