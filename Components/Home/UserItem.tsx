import { FontAwesome } from "@expo/vector-icons";
import {
  backgroundColor,
  lightTextColor,
  paddingLarge,
  paddingMedium,
  paddingSmall,
  textMedium,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import React, {
  FunctionComponent,
  useContext,
  useState,
  MouseEvent,
} from "react";
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UserContext } from "../../Context/UserContext";
import { User } from "../../Types/types";
import { enableLayoutAnimations } from "react-native-reanimated";

interface UserItemProps {
  item: any;
}

const UserItem: FunctionComponent<UserItemProps> = (item: any) => {
  const [selected, setSelected] = useState<Boolean>(false);
  //handleRemove: display remove button and trigger remove event
  //handleSelect: highlight selected user and trigger select event
  const { handleRemove, handleSelect } = useContext(UserContext);
  const itemUser = item.item.item as User;
  //define feature of user list
  return (
    <TouchableOpacity
      style={[styles.userItemTouchableOpacity]}
      onPress={() => {
        if (handleSelect) {
          handleSelect(itemUser.id);
          setSelected(!selected);
        }
      }}
      disabled={!handleSelect}
    >
      <View
        style={[
          styles.userItemView,
          handleSelect && selected ? styles.selected : styles.deselected,
        ]}
      >
        <View style={styles.userItemInfoContainer}>
          <FontAwesome
            name="user-circle"
            size={windowWidth * 0.1}
            color="black"
            style={styles.userItemIcon}
          />
          <Text
            style={[
              handleSelect && selected ? styles.selected : styles.deselected,
            ]}
          >
            {itemUser.profile?.id}
            {/* {itemUser.profile?.lastname + " " + itemUser.profile?.firstname} */}
          </Text>
        </View>
        <View
          style={[
            handleRemove ? {} : { display: "none" },
            styles.userItemButtonContainer,
            handleSelect && selected ? styles.selected : styles.deselected,
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              handleRemove ? handleRemove(itemUser) : {};
            }}
          >
            <FontAwesome
              name="user-times"
              size={windowWidth * 0.05}
              color={selected ? backgroundColor : lightTextColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  userItemView: {
    flexDirection: "row",
    borderRadius: windowWidth * 0.025,
    padding: paddingMedium,
    margin: paddingMedium,
    marginLeft: paddingLarge,
    marginRight: paddingLarge,
  },
  userItemTouchableOpacity: {},
  userItemDeselected: {
    backgroundColor: backgroundColor,
  },
  userItemInfoContainer: {
    flexDirection: "row",
    flex: 1,
  },
  userItemButtonContainer: {
    alignItems: "flex-end",
    flex: 1,
    justifyContent: "center",
  },
  userItemButton: {},
  userItemIcon: {
    marginRight: paddingMedium,
  },
  selected: {
    color: backgroundColor,
    backgroundColor: lightTextColor,
    fontSize: textMedium,
  },
  deselected: {
    color: lightTextColor,
    backgroundColor: backgroundColor,
    fontSize: textMedium,
  },
});
