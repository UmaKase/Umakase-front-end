import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  backgroundColor,
  drawerColor,
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

type Props = NativeStackScreenProps<InitialStepsProps, "SelectTagScreen">;

const SelectTagScreen: React.FC<Props> = ({ navigation, route }) => {
  // tag var
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  // text input state
  const [inputText, setInputText] = useState<string>("");
  // api request page number
  const [page, setPage] = useState<number>(1);

  // fetch tags http request
  const getTags = async () => {
    axios({
      method: "get",
      url: `${TagAPI}/?take=20&page=${page}`,
    })
      .then((res) => {
        setTags(res.data.data.tags);
        // show what is in the res.data.data.tags
        res.data.data.tags.forEach((t: Tag) => {
          console.log(t.name + " " + t.id);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // search tag http request
  const debounceSearchTags = useCallback(
    _.debounce((input: string) => {
      console.log(input);
    }, 500),
    []
  );

  // function activate after FlatList reached the end
  const onScrollToButtom = () => {
    setPage((prev) => prev + 1);
    console.log(page);
    axios({
      method: "get",
      url: `${TagAPI}/?take=20&page=${page}`,
    })
      .then((res) => {
        setTags((prev) => [...prev, ...res.data.data.tags]);
      })
      .catch((e) => {
        console.log(e);
      });
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
    navigation.navigate("SelectFoodScreen");
  };

  // initial loading function
  useEffect(() => {
    getTags();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerFont}>
            お気入り料理の種類を{"\n"}
            選択してください
          </Text>
        </View>
        {/* search bar */}
        <SearchBar
          input={inputText}
          setInput={setInputText}
          placeholderText="enter tag name to search"
          searchFunction={(input: string) => debounceSearchTags(input)}
          searchBtnFunc={() => {}}
        ></SearchBar>

        {/* card container */}
        <FlatList
          data={tags}
          keyExtractor={(item, index) => index.toString()}
          style={styles.tagContainer}
          columnWrapperStyle={{ justifyContent: "space-evenly" }}
          numColumns={2}
          onEndReached={() => onScrollToButtom()}
          renderItem={({ item }) => {
            const isChecked = selectedTag.find((tagId) => tagId === item.id)
              ? true
              : false;
            return (
              <ToggleTag
                tag={item}
                check={isChecked}
                onPressHandler={() => {
                  if (isChecked) {
                    setSelectedTag((prev) =>
                      prev.filter((id) => id !== item.id)
                    );
                  } else {
                    setSelectedTag((prev) => [...prev, item.id]);
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
  searchbarContainer: {
    width: windowWidth,
    height: windowHeight * 0.06,
    flexDirection: "row",
    paddingLeft: windowWidth * 0.1,
    paddingRight: windowWidth * 0.05,
  },
  searchbar: {
    flex: 5,
    fontSize: windowWidth * 0.065,
    color: "#FFF",
  },
  searchBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
