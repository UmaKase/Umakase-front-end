import React, { useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { backgroundColor, windowHeight, windowWidth } from "../../Constants/cssConst";
import { FlatList } from "react-native-gesture-handler";
import Footer from "../../Components/InitialStep/Footer";
import { FontAwesome } from "@expo/vector-icons";
import ToggleTag from "../../Components/InitialStep/ToggleTag";
import { TagCheck } from "../../Types/InitialSteps";
import SearchBar from "../../Components/InitialStep/SearchBar";
import _ from "lodash";
import ToggleTagForSearch from "../../Components/InitialStep/ToggleTagForSearch";
import useTagFetch from "../../Hooks/useTagFetch";
import useSearchTagFetch from "../../Hooks/useSearchTagFetch";
import useSubmit from "../../Hooks/InitialStage/useSubmit";
import ListFooterComponent from "../../Components/Universal/ListFooterComponent";
import SubmitStatus from "../../Components/InitialStep/SubmitStatus";
import SearchModal from "../../Components/Universal/SearchModal";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectTagScreen">;

const SelectTagScreen: React.FC<Props> = ({ navigation, route }) => {

  // useTagFetch to control food Page
  const [tags, setTags, tagPageAdd, tagPageEnd] = useTagFetch();
  const [searchModeController, searchTagController] = useSearchTagFetch(tags);
  // useSubmit to control submit process
  const [submitStart, loadingText, submit] = useSubmit();

  // emtpy TagCheck as fake data for tag list while the length%2 !== 0\
  const emptyTag: TagCheck = {
    id: "",
    name: "",
    food: [],
    checked: false,
  }

  // next step function
  const goNextStep = async () => {
    const selectedTags = tags.filter((tag) => tag.checked === true);
    navigation.navigate("SelectFoodScreen", { tags: selectedTags, tagIds: selectedTags.map((tag) => tag.id) });
  };


  // SECTION renderItem of FlatList for tag & searchTag
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

  // NOTE render item for search tag FlatList
  const renderItemTagSearch = useCallback(({ item, index }: { item: TagCheck; index: number }) => {
    function onPressHandler() {
      // NOTE check if the tag is already in the list
      const tagAlreadyExist = tags.find((tag) => tag.id === item.id);
      // NOTE if the tag is already in the list, then change the searchTags checked status to match the tag in the list
      if (tagAlreadyExist) {
        setTags((prev) => {
          const newState = [...prev];
          const tagIndex = newState.findIndex((tag) => tag.id === item.id);
          newState[tagIndex].checked = !item.checked;
          return newState;
        });
      } else {
        // NOTE if the tag is not in the list, then add it to the list and set checked value to false
        setTags((prev) => {
          const newState = [...prev, { ...item, checked: false }];
          return newState;
        });
      }

      // NOTE change the searchTags checked status
      searchTagController.setSearchTags((prev) => {
        const newState = [...prev];
        newState[index].checked = !item.checked;
        return newState;
      })
    }
    return <ToggleTagForSearch tag={item} onPressHandler={onPressHandler} ></ToggleTagForSearch>
  }, [searchTagController.searchTags])
  // !SECTION ==========================================================================================================


  // SECTION components for SelectTagScreen

  const Header: React.FC = () => {
    return (
      <View>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerFont}>
            お気入り料理の種類を{"\n"}
            選択してください
          </Text>
        </View>
        {/* search Btn */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={searchModeController.searchModeStart}>
            <FontAwesome
              name="search"
              size={windowWidth * 0.07}
              // color={backgroundColor}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const ModalFooter: React.FC = () => {
    return (
      <View style={styles.modalFooter}>
        <TouchableOpacity
          onPress={searchModeController.searchModeEnd}
          style={styles.modalSubmit}
        >
          <Text style={styles.modalSubmitText}>確定</Text>
        </TouchableOpacity>
      </View>
    )
  }
  // !SECTION ==========================================================================================================

  return (
    <SafeAreaProvider style={{ alignItems: "center", justifyContent: "center", backgroundColor: submitStart ? backgroundColor : "#FFF" }}>
      {submitStart ? (
        <SubmitStatus loadingText={loadingText} />
      ) : (
        <SafeAreaView style={[styles.safeArea, { opacity: searchModeController.searchMode ? 0.7 : 1 }]}>
          <Header />
          {/* NOTE Tags List */}
          <FlatList
            data={tags.length % 2 === 0 ? tags : [...tags, emptyTag]}
            extraData={tags}
            keyExtractor={(item, index) => index.toString()}
            style={styles.tagContainer}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            numColumns={2}
            onEndReached={() => tagPageAdd()}
            renderItem={renderItemTag}
            ListFooterComponent={() => {
              return <ListFooterComponent reachedEnd={tagPageEnd} reachedEndText={"this is the end of the tags list."} />
            }}
          />
          {/* footer */}
          <Footer
            goBackFunc={() => navigation.goBack()}
            goNextFunc={() => goNextStep()}
            skipFunc={() => submit({})}
          />
          {/* search modal */}
          <SearchModal visible={searchModeController.searchMode} onBackdropPress={searchModeController.searchModeEnd} >
            <SearchBar input={searchTagController.input} setInput={searchTagController.setInput} placeholderText="種類を入力してください" searchFunction={(input: string) => searchTagController.debounceSearchFunction(input)} />
            {/* NOTE Search Tags List */}
            <FlatList
              data={searchTagController.searchTags.length % 2 === 0 ? searchTagController.searchTags : [...searchTagController.searchTags, emptyTag]}
              keyExtractor={(item, index) => index.toString()}
              style={styles.tagContainer}
              columnWrapperStyle={{ justifyContent: "space-evenly" }}
              numColumns={2}
              onEndReached={searchTagController.searchPageAdd}
              renderItem={renderItemTagSearch}
            />
            <ModalFooter />
          </SearchModal>
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
};

export default SelectTagScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  header: {
    height: windowHeight * 0.12,
    width: windowWidth,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerFont: {
    fontSize: windowWidth * 0.08,
    color: "#FFF",
  },
  searchContainer: {
    width: windowWidth,
    height: windowHeight * 0.06,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: windowWidth * 0.1,
  },
  tagContainer: {
    flex: 1,
    // flexWrap: "wrap",
    // justifyContent: "space-between",
  },
  footer: {
    height: windowHeight * 0.1,
    width: windowWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    width: 100,
    height: 50,
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonFont: {
    fontSize: windowWidth * 0.05,
    color: "#000",
  },

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
  modalFooter: {
    width: windowWidth,
    height: windowHeight * 0.15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmit: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.05,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: backgroundColor,
    borderRadius: windowWidth * 0.03,
  },
  modalSubmitText: {
    fontSize: windowWidth * 0.05,
    color: "#FFF",
  },
});
