import { StyleSheet, View } from 'react-native'
import React from 'react'
import { windowHeight, windowWidth } from '../../Constants/cssConst'
import Modal from "react-native-modal";

type SearchModalType = {
  children: React.ReactNode;
  visible: boolean;
  onBackdropPress: () => void;
}

// create a SearchModal component have multiple React.FC components inside as children
const SearchModal: React.FC<SearchModalType> = ({ children, visible, onBackdropPress }) => {
  return (
    <Modal isVisible={visible} onBackdropPress={onBackdropPress} style={styles.modal} avoidKeyboard={true}>
      <View style={styles.modalBackground}>
        {children}
      </View>
    </Modal>
  )
}

export default SearchModal

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalBackground: {
    flex: 0.75,
    height: windowHeight * 0.75, //giving the height because of the flatlist need a fix height to be scrollable
    backgroundColor: "#FFF",
    borderTopLeftRadius: windowWidth * 0.05,
    borderTopRightRadius: windowWidth * 0.05,
  },
})