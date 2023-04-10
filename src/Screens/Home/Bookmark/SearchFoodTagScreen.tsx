import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookmarkedStackProps } from "../../../Types/Navigations/HomeDrawer/BookmarkedStack";
import Background from "../../../Components/Universal/Background";
import SearchBarForBookMark from "../../../Components/Home/Bookmark/SearchBarForBookMark";
import _ from "lodash";
import { Tag } from "../../../Types/InitialSteps";
import { FontAwesome } from "@expo/vector-icons";
import {
  paddingMedium,
  textLarge,
  lightTextColor,
  windowWidth,
} from "../../../Constants/cssConst";
import ToggleTag from "../../../Components/InitialStep/ToggleTag";
import { TagContext } from "../../../Context/TagContext";
type Props = NativeStackScreenProps<
  BookmarkedStackProps,
  "SearchFoodTagScreen"
>;
const SearchFoodTagScreen: React.FC<Props> = ({ route, navigation }) => {
  const { contextTags, setContextTags } = useContext(TagContext);
  const { tags } = route.params;
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const searchTagFunction = useCallback(
    _.debounce(async (input: string) => {
      if (input === "") {
        setSearchTags(tags);
      } else {
      }
    }, 500),
    []
  );

  // go back function
  const goBack = () => {
    setContextTags(selectedTags);
    navigation.navigate("FavoriteFoodScreen");
  };

  return (
    <Background headerOption={false}>
      {/* header arrow */}
      <TouchableOpacity
        onPress={() => goBack()}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: paddingMedium,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome
          name="angle-double-up"
          size={windowWidth * 0.12}
          color={lightTextColor}
        />
      </TouchableOpacity>
      <SearchBarForBookMark
        input={textInput}
        setInput={setTextInput}
        placeholderText="探すタグ"
        searchFunction={() => {}}
      />
      {/* tags */}
      <FlatList
        data={tags}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-evenly" }}
        renderItem={({ item }) => {
          let checkFlag = selectedTags.find((tag) => tag == item)
            ? true
            : false;
          return (
            <ToggleTag
              tag={{ id: item, name: item, food: [] }}
              check={checkFlag}
              onPressHandler={() => {
                if (checkFlag) {
                  setSelectedTags((prev) => prev.filter((tag) => tag !== item));
                } else {
                  setSelectedTags((prev) => [item, ...prev]);
                }
              }}
            />
          );
        }}
      />
    </Background>
  );
};

export default SearchFoodTagScreen;

const styles = StyleSheet.create({});
