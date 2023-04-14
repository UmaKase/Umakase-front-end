import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { FavoriteFoodInterface } from "../../../Types/InitialSteps";
import { backgroundColor, drawerColor, windowHeight, windowWidth } from "../../../Constants/cssConst";
import { ImgAPI } from "../../../Constants/backendAPI";
import CacheImage from "../../Universal/CacheImage";
import { FontAwesome } from "@expo/vector-icons";
import useModeChangeAnimation from "../../../Hooks/favoriteFood/useModeChangeAnimation";

interface FavoriteFoodProps {
  favFood: FavoriteFoodInterface;
  onLikePressHandler: () => void;
  onDeletePressHandler: () => void;
  editMode: boolean;
}

const FavoriteFood: React.FC<FavoriteFoodProps> = React.memo(({ favFood, onLikePressHandler, onDeletePressHandler, editMode }) => {
  // destructure favFood
  const { food, isFavorite } = favFood;
  // useModeChangeAnimation hook
  const [ModeAnimatedView, startVibratingAnimation, stopVibratingAnimation] = useModeChangeAnimation();

  useEffect(() => {
    if (editMode) {
      startVibratingAnimation();
    } else {
      stopVibratingAnimation();
    }
  }, [editMode]);

  return (
    food.id === "" ? <View style={styles.cardBackground}></View> :
      <ModeAnimatedView>
        <View style={[styles.cardBackground]}>
          <View style={styles.imgContainer}>
            {food.img ? (
              <CacheImage url={`${ImgAPI}/food/${food.img}`} style={styles.img} />
            ) : (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#777" }}>No Image</Text>
              </View>
            )}
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{food.name}</Text>
          </View>
          {/* edit button */}
          {editMode && (
            <>
              <TouchableOpacity onPress={onDeletePressHandler} style={[styles.editButton, { left: -10 }]}>
                <FontAwesome name="minus" size={iconSize} color="#55F" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onLikePressHandler} style={[styles.editButton, { right: -10 }]}>
                {isFavorite ? (
                  <FontAwesome name="heart" size={iconSize} color="#F55" />
                ) : (
                  <FontAwesome name="heart-o" size={iconSize} color="#F55" />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </ModeAnimatedView>
  );
});

export default FavoriteFood;

const width = windowWidth * 0.35;
const height = (width * 4) / 3;
const borderRadius = windowWidth * 0.04;
const iconSize = windowWidth * 0.06;

const styles = StyleSheet.create({
  cardBackground: {
    width: width,
    height: height,
    borderRadius: borderRadius,
    marginVertical: windowHeight * 0.01,
    marginTop: windowHeight * 0.02,
    backgroundColor: backgroundColor,
    position: "relative",
  },
  imgContainer: {
    flex: 3,
    resizeMode: "contain",
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    backgroundColor: drawerColor,
    // alignItems: "center",
    // justifyContent: "center",
  },
  img: {
    flex: 1,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    resizeMode: "cover",
  },
  nameContainer: {
    flex: 1,
    borderRadius: borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: windowWidth * 0.04,
    flexWrap: "wrap",
    color: "#FFF"
  },
  editButton: {
    backgroundColor: "#FFF",
    width: windowWidth * 0.09,
    height: windowWidth * 0.09,
    borderRadius: windowWidth * 0.045,
    position: "absolute",
    top: -10,
    alignItems: "center",
    justifyContent: "center",
  }
});
