import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { CONFIG_KEY } from "../../Constants/securestoreKey";
import { TagAPI } from "../../Constants/backendAPI";
import { FlatList } from "react-native-gesture-handler";
import Footer from "../../Components/InitialStep/Footer";
import { CommonActions } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import ToggleTag from "../../Components/InitialStep/ToggleTag";
import { Tag } from "../../types/InitialSteps";
import SearchBar from "../../Components/InitialStep/SearchBar";
import _ from "lodash";
import BottomSheet from "@gorhom/bottom-sheet";
import ToggleTagForSearch from "../../Components/InitialStep/ToggleTagForSearch";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectTagScreen">;

const SelectTagScreen: React.FC<Props> = ({ navigation, route }) => {
  // tag var
  const [tags, setTags] = useState<Tag[]>([]);
  // selected tags id string[]
  const [selectedTagId, setSelectedTagId] = useState<string[]>([]);
  // text input state
  const [inputText, setInputText] = useState<string>("");
  // api request page number
  const [page, setPage] = useState<number>(1);
  // fetch tag API reached end page
  const [tagEnd, setTagEnd] = useState(false);

  // search tags
  const [searchTags, setSearchTags] = useState<Tag[]>([]);
  // search request page
  const [searchPage, setSearchPage] = useState<number>(1);
  // search API reached end page
  const [searchEnd, setSearchEnd] = useState(false);

  // search mode contorller boolean
  const [searchMode, setSearchMode] = useState(false);

  // search tag http request
  const debounceSearchTags = useCallback(
    _.debounce((input: string) => {
      if (input === "") {
        setSearchTags([]);
        setSearchPage(1);
      } else {
        axios({
          method: "post",
          url: `${TagAPI}/?name=${input}&take=20&page=${searchPage}`,
          data: {
            excludes: selectedTagId,
          },
        })
          .then((res) => {
            setSearchTags(res.data.data.tags);
            console.log(`${TagAPI}/?name=${input}&take=20&page=${searchPage}`);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }, 500),
    []
  );

  // function activate after FlatList reached the end
  const onScrollToBottom = () => {
    setPage((prev) => prev + 1);
  };

  // search modal on reached end handler
  const onModalScrollToBottom = () => {
    setSearchPage((prev) => prev + 1);
  };

  // skip function
  const skipSetting = async () => {
    await SecureStore.setItemAsync(CONFIG_KEY, "Completed");
    console.log("saved");
    navigation.dispatch(
      CommonActions.reset({ routes: [{ name: "HomeDrawerNavigation" }] })
    );
  };
  // next step function
  const goNextStep = async () => {
    console.log(selectedTagId);
    navigation.navigate("SelectFoodScreen", { TargetTags: selectedTagId });
  };

  // get tags function (base on page change)
  useEffect(() => {
    if (!tagEnd) {
      axios({
        method: "post",
        url: `${TagAPI}/?take=20&page=${page}`,
        data: {
          excludes: selectedTagId,
        },
      })
        .then((res) => {
          if (res.data.data.tags[0]) {
            setTags((prev) => [...prev, ...res.data.data.tags]);
          } else {
            setTagEnd(true);
          }
          console.log(`${TagAPI}/?take=20&page=${page}`);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [page]);

  // search tag on reachend handler
  useEffect(() => {
    if (searchPage !== 1 && !searchEnd) {
      axios({
        method: "post",
        url: `${TagAPI}/?name=${inputText}&take=20&page=${searchPage}`,
        data: {
          excludes: selectedTagId,
        },
      })
        .then((res) => {
          if (res.data.data.tags[0]) {
            setSearchTags((prev) => [...prev, ...res.data.data.tags]);
          } else {
            setSearchEnd(true);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [searchPage]);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.safeArea, { opacity: searchMode ? 0.7 : 1 }]}
      >
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerFont}>
            お気入り料理の種類を{"\n"}
            選択してください
          </Text>
        </View>
        {/* search Btn */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => {
              setSearchMode((prev) => !prev);
            }}
          >
            <FontAwesome
              name="search"
              size={windowWidth * 0.07}
              // color={backgroundColor}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
        {/* card container */}
        <FlatList
          data={tags}
          extraData={tags}
          keyExtractor={(item, index) => index.toString()}
          style={styles.tagContainer}
          columnWrapperStyle={{ justifyContent: "space-evenly" }}
          numColumns={2}
          onEndReached={() => onScrollToBottom()}
          renderItem={({ item, index }) => {
            const tempTag = tags[index];
            const isChecked = selectedTagId.find((tagId) => tagId === item.id)
              ? true
              : false;
            return (
              <ToggleTag
                tag={item}
                check={isChecked}
                onPressHandler={() => {
                  if (isChecked) {
                    setSelectedTagId((prev) =>
                      prev.filter((id) => id !== item.id)
                    );
                  } else {
                    setSelectedTagId((prev) => [...prev, item.id]);
                    setTags((prev) => {
                      return [
                        tempTag,
                        ...prev.filter((target) => target.id != tempTag.id),
                      ];
                    });
                  }
                }}
              ></ToggleTag>
            );
          }}
        />
        {/* footer */}
        <Footer
          goBackFunc={() => navigation.goBack()}
          goNextFunc={() => goNextStep()}
          skipFunc={() => skipSetting()}
        />
      </SafeAreaView>
      {/* modal */}
      {searchMode ? (
        <BottomSheet
          snapPoints={["75%"]}
          handleIndicatorStyle={{ backgroundColor: "#FFF" }}
          backgroundStyle={{ backgroundColor: "#FFF" }}
        >
          <SearchBar
            input={inputText}
            setInput={setInputText}
            placeholderText="種類を入力してください"
            searchFunction={(input: string) => debounceSearchTags(input)}
          ></SearchBar>
          <FlatList
            data={searchTags}
            extraData={searchTags}
            keyExtractor={(item, index) => index.toString()}
            style={styles.tagContainer}
            columnWrapperStyle={{ justifyContent: "space-evenly" }}
            numColumns={2}
            onEndReached={() => onModalScrollToBottom()}
            renderItem={({ item, index }) => {
              const isChecked = selectedTagId.find((tagId) => tagId === item.id)
                ? true
                : false;
              return (
                <ToggleTagForSearch
                  tag={item}
                  check={isChecked}
                  onPressHandler={() => {
                    const tempSearchTag = searchTags[index];
                    if (isChecked) {
                      setSelectedTagId((prev) =>
                        prev.filter((id) => id !== item.id)
                      );
                    } else {
                      setSelectedTagId((prev) => [...prev, item.id]);
                      setTags((prev) => {
                        return [
                          tempSearchTag,
                          ...prev.filter(
                            (target) => target.id != tempSearchTag.id
                          ),
                        ];
                      });
                    }
                  }}
                ></ToggleTagForSearch>
              );
            }}
          />
          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={() => {
                setSearchMode((prev) => !prev);
                setInputText("");
                setSearchTags([]);
                setSearchPage(1);
              }}
              style={styles.modalSubmit}
            >
              <Text style={styles.modalSubmitText}>確定</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      ) : (
        <></>
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

  modalFooter: {
    // backgroundColor: "#FFF",
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
