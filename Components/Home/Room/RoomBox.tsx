import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { windowWidth, windowHeight } from "../../../Constants/cssConst";

type Props = {
  onPressHandler: () => void;
  roomName: string;
  roomies?: string[];
  roomImg?: string[];
};
const RoomBox: React.FC<Props> = ({
  onPressHandler,
  roomName,
  roomies,
  roomImg,
}) => {
  const image = require("../../../Image/TempRoomBlockImage.png");
  return (
    <TouchableOpacity onPress={onPressHandler} style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={{ flex: 1 }}
        imageStyle={{ borderRadius: borderRadius }}
      >
        <View style={styles.transparentLayer}>
          <View
            style={{
              height: innerContainerHeight,
              flexDirection: "row",
              paddingHorizontal: windowWidth * 0.05,
            }}
          >
            <FontAwesome
              name="user-circle"
              size={innerContainerHeight}
              color="black"
            />
            <View style={{ flex: 1, paddingLeft: windowWidth * 0.04 }}>
              <Text
                style={{
                  color: "#ECAC72",
                  fontSize: innerContainerHeight / 3.8,
                  fontWeight: "600",
                }}
              >
                {roomName === "__default" ? "My Room" : roomName}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                {roomies && roomies[1] ? <FontAwesome
                  name="user-circle"
                  size={innerContainerHeight / 2}
                  color="black"
                /> : null
                }
                {roomies && roomies[2] ? <FontAwesome
                  name="user-circle"
                  size={innerContainerHeight / 2}
                  color="black"
                /> : null
                }
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default RoomBox;

const borderRadius = windowWidth * 0.02;
const innerContainerHeight = windowHeight * 0.18 * 0.6;
const styles = StyleSheet.create({
  container: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.18,
    borderRadius: borderRadius,
    marginTop: windowHeight * 0.02,
  },
  transparentLayer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: borderRadius,
    justifyContent: "center",
  },
});
