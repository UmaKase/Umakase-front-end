import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookmarkedStackProps } from "../../../Types/Navigations/HomeDrawer/BookmarkedStack";
import Background from "../../../Components/Universal/Background";
import SearchBarForBookMark from "../../../Components/Home/Bookmark/SearchBarForBookMark";
import _ from "lodash";
import { TagCheck } from "../../../Types/InitialSteps";
import { FontAwesome } from "@expo/vector-icons";
import { lightTextColor, windowWidth, windowHeight, paddingLarge, darkerBackgroundColor } from "../../../Constants/cssConst";
import ToggleTag from "../../../Components/InitialStep/ToggleTag";
import useTagFetch from "../../../Hooks/useTagFetch";
import ListFooterComponent from "../../../Components/Universal/ListFooterComponent";

type HeaderType = {
  goBackFunction: () => void
}
const Header: React.FC<HeaderType> = ({ goBackFunction }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.subIconView}>
        <TouchableOpacity onPress={goBackFunction}>
          <FontAwesome name="chevron-left" size={windowWidth * 0.07} color={lightTextColor} />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>料理追加</Text>
      <View style={styles.subIconView}></View>
    </View>
  )
}

type FooterType = {
  searchFunction: () => void;
}
const Footer: React.FC<FooterType> = ({ searchFunction }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.searchButton} onPress={searchFunction}>
        <Text style={styles.searchButtonTextStyle}>検索</Text>
      </TouchableOpacity>
    </View>
  )
}

type Props = NativeStackScreenProps<
  BookmarkedStackProps,
  "SearchFoodTagScreen"
>;
const SearchFoodTagScreen: React.FC<Props> = ({ navigation }) => {
  // emtpy TagCheck as fake data for tag list while the length%2 !== 0
  const emptyTag: TagCheck = {
    id: "",
    name: "",
    food: [],
    checked: false,
  }

  // useTagFetch to get all tags
  const [tags, setTags, tagPageAdd, tagPageEnd, selectAll, setSelectAll] = useTagFetch();
  const [textInput, setTextInput] = useState("");

  function submitSearch() {
    // getting selected tags & textInput and pass it to search result page
    navigation.navigate("SearchFoodResultScreen", { tags: tags.filter((tag) => tag.checked).map((tag) => tag.id), searchFood: textInput });
  }

  // NOTE render item for tag FlatList
  const renderItemTag = useCallback(({ item, index }: { item: TagCheck; index: number }) => {
    function onPressHandler() {
      setTags((prev) => {
        const newState = [...prev];
        newState[index].checked = !item.checked;
        return newState;
      })
    }
    return <ToggleTag tag={item} onPressHandler={onPressHandler}></ToggleTag>
  }, [tags])

  return (
    <Background headerOption={false}>
      {/* header arrow */}
      <Header goBackFunction={() => navigation.pop()} />
      <SearchBarForBookMark
        input={textInput}
        setInput={setTextInput}
        placeholderText="追加したい料理を入力してください"
        // selectAll={selectAll}
        // setSelectAll={setSelectAll}
      />
      {/* tags */}
      <FlatList
        data={tags.length % 2 === 0 ? tags : [...tags, emptyTag]}
        extraData={tags}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: windowWidth * 0.05 }}
        columnWrapperStyle={{ justifyContent: "space-evenly" }}
        numColumns={2}
        onEndReached={tagPageAdd}
        renderItem={renderItemTag}
        ListFooterComponent={() => {
          return <ListFooterComponent reachedEnd={tagPageEnd} reachedEndText={"this is the end of the tags list."} />
        }}
      />
      <Footer searchFunction={submitSearch} />
    </Background>
  );
};

export default SearchFoodTagScreen;

const styles = StyleSheet.create({
  // header
  headerContainer: {
    width: windowWidth,
    height: windowHeight * 0.07,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: paddingLarge,
  },
  subIconView: {
    width: windowWidth * 0.1,
    height: windowHeight * 0.07,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: windowHeight * 0.04,
    color: lightTextColor,
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,
  },

  // footer
  footerContainer: {
    width: windowWidth,
    height: windowHeight * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButton: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    borderRadius: windowWidth * 0.05,
    backgroundColor: "#FFF"
  },
  searchButtonTextStyle: {
    color: darkerBackgroundColor,
    fontSize: windowWidth * 0.04,
  }
});
