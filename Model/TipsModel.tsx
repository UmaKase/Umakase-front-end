import { functionTipsMessage, tipCloseStr } from "../Constants/homeConst";
import React, { useContext, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TipsContext } from "../Context/TipsContext";
import {
  backgroundColor,
  paddingSmall,
  windowHeight,
  windowWidth,
} from "../Constants/cssConst";
import { FontAwesome, Fontisto } from "@expo/vector-icons";

interface ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tipMessages: string[];
}
export const TipsModel: React.FunctionComponent<ModalProps> = ({
  modalVisible,
  setModalVisible,
  tipMessages,
}) => {
  const [tipPage, setTipPage] = useState(0);
  const nextPageFunc = () => {
    if (tipMessages.length - 1 > tipPage) setTipPage(tipPage + 1);
    console.log("tipPage:" + tipPage);
    console.log("tipMessages.length: " + tipMessages.length);
    console.log("current page:" + tipPage);
  };
  const prevPageFunc = () => {
    if (tipPage > 0) setTipPage(tipPage - 1);
    console.log("current page:" + tipPage);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View style={{ flex: 1, justifyContent: "center" }}></View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  prevPageFunc();
                }}
                style={{ width: windowWidth * 0.1 }}
              >
                <FontAwesome
                  name="arrow-circle-left"
                  size={windowWidth * 0.1}
                  style={
                    tipMessages.length > 1 && tipPage > 0
                      ? {}
                      : { display: "none" }
                  }
                  color="#2196F3"
                />
              </TouchableOpacity>
              <Text style={styles.modalText}>{tipMessages[tipPage]}</Text>
              <TouchableOpacity
                onPress={() => {
                  nextPageFunc();
                }}
                style={{ width: windowWidth * 0.1 }}
              >
                <FontAwesome
                  name="arrow-circle-right"
                  style={
                    tipMessages.length > 1 && tipMessages.length - 1 > tipPage
                      ? {}
                      : { display: "none" }
                  }
                  size={windowWidth * 0.1}
                  color="#2196F3"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>{tipCloseStr}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
const arrowSize = windowHeight * 0.08;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: paddingSmall,
    height: windowHeight * 0.5,
    width: windowWidth * 0.7,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modelPic: {
    margin: windowWidth * 0.05,
  },
  modalText: {
    width: windowWidth * 0.4,
    marginLeft: windowWidth * 0.02,
    marginRight: windowWidth * 0.02,
    marginBottom: windowWidth * 0.07,
    textAlign: "left",
  },
});
