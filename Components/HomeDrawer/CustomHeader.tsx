import React, { useContext, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  lightTextColor,
  paddingLarge,
  paddingMedium,
  paddingSmall,
  windowWidth,
} from "../../Constants/cssConst";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TipsModel } from "../../Model/TipsModel";
import { TipsContext } from "../../Context/TipsContext";
import { functionTipsMessage } from "../../Constants/homeConst";

interface CustomHeaderProps {
  toggleMenu: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ toggleMenu }) => {
  const [modalVisible, setModalVisible] = useState(false);
  //get tip messages based on function
  const { currentCategory } = useContext(TipsContext);
  const tipMessages = functionTipsMessage[currentCategory];
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => toggleMenu()}>
          <FontAwesome name="bars" size={30} color={lightTextColor} />
        </TouchableOpacity>
      </View>
      <View
        style={{ flex: 1, justifyContent: "flex-end", flexDirection: "row" }}
      >
        <TouchableOpacity
          style={[
            styles.iconContainer,
            tipMessages == undefined || tipMessages[0] == ""
              ? { display: "none" }
              : { display: "flex" },
          ]}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <FontAwesome
            name="question-circle"
            size={30}
            color={lightTextColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => Alert.alert("notification", "this is on todo list.")}
        >
          <FontAwesome name="bell" size={30} color={lightTextColor} />
        </TouchableOpacity>
      </View>
      <TipsModel
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        tipMessages={tipMessages}
      />
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
    paddingRight: paddingLarge,
  },
});
function setModalVisible(arg0: boolean) {
  throw new Error("Function not implemented.");
}
