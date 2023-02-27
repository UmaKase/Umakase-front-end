import { tipCloseStr } from "../Constants/homeConst";
import React, { useContext, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TipsContext } from "../Context/TipsContext";
import { paddingSmall, windowHeight, windowWidth } from "../Constants/cssConst";
import { FontAwesome } from "@expo/vector-icons";
const tipImages = {
  0: [null],
  1: [require("../Image/Tips/homepage.jpg")],
  2: [require("../Image/Tips/room1.jpg"), require("../Image/Tips/room2.jpg")],
  3: [null],
  4: [
    require("../Image/Tips/favorite1.jpg"),
    require("../Image/Tips/favorite2.jpg"),
    require("../Image/Tips/favorite3.jpg"),
  ],
  5: [null],
  6: [null],
  7: [null],
  8: [null],
};
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
  const { currentCategory } = useContext(TipsContext);
  const tipImagesLoad = tipImages[currentCategory];
  const nextPageFunc = () => {
    if (tipMessages.length - 1 > tipPage) setTipPage(tipPage + 1);
  };
  const prevPageFunc = () => {
    if (tipPage > 0) setTipPage(tipPage - 1);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View
              style={{
                flex: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image style={styles.modelPic} source={tipImagesLoad[tipPage]} />
            </View>
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
              <Text
                style={[
                  styles.modalText,
                  tipMessages.length > 1 ? {} : { width: windowWidth * 0.6 },
                ]}
              >
                {tipMessages[tipPage]}
              </Text>
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
    width: windowWidth * 0.6,
    height: windowHeight * 0.2,
    padding: 5,
  },
  modalText: {
    width: windowWidth * 0.4,
    marginLeft: windowWidth * 0.02,
    marginRight: windowWidth * 0.02,
    marginBottom: windowWidth * 0.07,
    textAlign: "left",
  },
});
