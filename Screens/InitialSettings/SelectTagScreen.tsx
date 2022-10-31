import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../Types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import axios from "axios";
import {
  ACCESS_KEY,
  CONFIG_KEY,
  REFRESH_KEY,
  TEMPUSERID_KEY,
  TEMPUSERPASS_KEY,
} from "../../Constants/securestoreKey";
import { AuthAPI, TagAPI } from "../../Constants/backendAPI";
import { FlatList } from "react-native-gesture-handler";
import Footer from "../../Components/InitialStep/Footer";
import { CommonActions } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import ToggleTag from "../../Components/InitialStep/ToggleTag";
import { Tag } from "../../Types/InitialSteps";
import SearchBar from "../../Components/InitialStep/SearchBar";
import _ from "lodash";
import ToggleTagForSearch from "../../Components/InitialStep/ToggleTagForSearch";
import Modal from "react-native-modal";
import { setItemAsync } from "expo-secure-store";

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

  const [startSubmit, setStartSubmit] = useState(false);
  const [loadingText, setLoadingText] = useState("Creating new account");

  // search tag http request
  const debounceSearchTags = useCallback(
    _.debounce((input: string) => {
      if (input === "") {
        setSearchTags([]);
        setSearchPage(1);
      } else {
        axios({
          method: "post",
          url: `${TagAPI}/search?name=${input}&take=20&page=${searchPage}`,
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

  // leave search mode
  const leaveSearchMode = () => {
    setSearchMode(false);
    setInputText("");
    setSearchTags([]);
    setSearchPage(1);
  };

  // skip function
  const skipSettingFunction = async () => {
    setStartSubmit(true);
    let tempData = undefined;
    // phase 1 register a temp user
    try {
      const res = await axios({
        method: "post",
        url: `${AuthAPI}/register`,
        data: {
          isTemp: true,
          foodIds: [],
          name: "__default",
        },
      });
      setItemAsync(TEMPUSERID_KEY, res.data.data.tmpId);
      setItemAsync(TEMPUSERPASS_KEY, res.data.data.tmpPass);
      tempData = {
        id: res.data.data.tmpId,
        pass: res.data.data.tmpPass,
      };
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 1");
    }

    // phase 2 login with temp user
    // prettier-ignore
    if(tempData === undefined){return console.log("Submit process failed with tempUserRegisterDate === undifined.")}
    setLoadingText("Login process");
    try {
      const res = await axios({
        method: "post",
        url: `${AuthAPI}/login`,
        data: {
          username: tempData.id,
          password: tempData.pass,
        },
      });
      setItemAsync(ACCESS_KEY, res.data.data.accessToken);
      setItemAsync(REFRESH_KEY, res.data.data.refreshToken);
      setItemAsync(CONFIG_KEY, "Completed");
      console.log("saved");
      navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: "HomeDrawerNavigation" }],
        })
      );
    } catch (error) {
      setStartSubmit(false);
      return Alert.alert("Submit Error", "Submit failed in phase 2");
    }
  };
  // next step function
  const goNextStep = async () => {
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
        url: `${TagAPI}/search?name=${inputText}&take=20&page=${searchPage}`,
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
    <SafeAreaProvider
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: startSubmit ? backgroundColor : "#FFF",
      }}
    >
      {startSubmit ? (
        <>
          <ActivityIndicator size="large" color="#FFF"></ActivityIndicator>
          <Text
            style={{
              color: "#FFF",
              fontSize: windowWidth * 0.05,
              marginTop: windowHeight * 0.03,
            }}
          >
            {loadingText}
          </Text>
        </>
      ) : (
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
            skipFunc={() => skipSettingFunction()}
          />
          {/* modal */}
          <Modal
            isVisible={searchMode}
            onBackdropPress={() => leaveSearchMode()}
            style={styles.modal}
          >
            <View style={styles.modalBackground}>
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
                  const isChecked = selectedTagId.find(
                    (tagId) => tagId === item.id
                  )
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
                    leaveSearchMode();
                  }}
                  style={styles.modalSubmit}
                >
                  <Text style={styles.modalSubmitText}>確定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
