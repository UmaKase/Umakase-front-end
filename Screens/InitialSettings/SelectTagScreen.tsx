import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ToggleCard from "../../Components/InitialStep/ToggleCard";
import {
  backgroundColor,
  drawerColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { Tag } from "../../types/InitialSteps/Tag";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { CONFIG_KEY, USERNAME_KEY } from "../../Constants/securestoreKey";
import { TagAPI } from "../../Constants/backendAPI";
import { FlatList } from "react-native-gesture-handler";
import Footer from "../../Components/InitialStep/Footer";
import { CommonActions } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import ToggleTag from "../../Components/InitialStep/ToggleTag";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectTagScreen">;

const SelectTagScreen: React.FC<Props> = ({ navigation, route }) => {
  // tag var
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  // text input state
  const [inputText, setInputText] = useState<string>("");
  const getTags = async () => {
    axios({
      method: "get",
      url: `${TagAPI}/`,
    })
      .then((res) => {
        console.log(JSON.stringify(res.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleSubmit = () => {
    console.log(selectedTag);
  };

  const fetchTags = async (): Promise<Tag[]> => {
    return [
      {
        id: "tag1",
        name: "name1",
      },
      {
        id: "tag2",
        name: "name2",
      },
      {
        id: "tag3",
        name: "name3",
      },
      {
        id: "tag4",
        name: "name4",
      },
      {
        id: "tag5",
        name: "name5",
      },
      {
        id: "tag6",
        name: "name6",
      },
      {
        id: "tag7",
        name: "name7",
      },
      {
        id: "tag8",
        name: "name8",
      },
    ];
  };

  const skipSetting = async () => {
    await SecureStore.setItemAsync(CONFIG_KEY, "Completed");
    console.log("saved");
    navigation.dispatch(
      CommonActions.reset({ routes: [{ name: "HomeDrawerNavigation" }] })
    );
  };

  const goNectStep = async () => {
    navigation.navigate("SelectFoodScreen");
  };

  useEffect(() => {
    // getTags();
    fetchTags().then((tags) => {
      setTags(tags);
    });
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
        <View style={styles.searchbarContainer}>
          <TextInput
            style={styles.searchbar}
            onChangeText={(newText) => setInputText(newText)}
            value={inputText}
            placeholder="enter tag name to find"
            placeholderTextColor={drawerColor}
            autoCapitalize="none"
            caretHidden={true}
          ></TextInput>
          <View style={styles.searchBtn}>
            <FontAwesome name="search" size={windowWidth * 0.07} color="#FFF" />
          </View>
        </View>
        {/* card container */}
        <FlatList
          data={tags}
          keyExtractor={(item, index) => index.toString()}
          style={styles.cardContainer}
          numColumns={2}
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
          goNextFunc={() => goNectStep()}
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
    color: drawerColor,
  },
  searchBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    flex: 1,
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
