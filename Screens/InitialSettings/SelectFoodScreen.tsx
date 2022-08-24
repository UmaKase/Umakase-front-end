import React, { useEffect, useState } from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { CONFIG_KEY } from "../../Constants/securestoreKey";
import { FontAwesome } from "@expo/vector-icons";
import {
  drawerColor,
  windowWidth,
  backgroundColor,
  windowHeight,
} from "../../Constants/cssConst";
import { Tag } from "../../types/InitialSteps/Tag";
import ToggleCard from "../../Components/InitialStep/ToggleCard";
import Footer from "../../Components/InitialStep/Footer";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectFoodScreen">;

const SelectFoodScreen: React.FC<Props> = ({ navigation, route }) => {
  // tag var
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  // text input state
  const [inputText, setInputText] = useState<string>("");

  //
  const fetchTags = async (): Promise<Tag[]> => {
    return [
      {
        id: "tag1",
        name: "name1name1name1name1name1",
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

  const settingComplete = async () => {
    await SecureStore.setItemAsync(CONFIG_KEY, "Completed");
    console.log("saved");
    navigation.dispatch(
      CommonActions.reset({ routes: [{ name: "HomeDrawerNavigation" }] })
    );
  };

  const skipSetting = async () => {
    await SecureStore.setItemAsync(CONFIG_KEY, "Completed");
    console.log("saved");
    navigation.dispatch(
      CommonActions.reset({ routes: [{ name: "HomeDrawerNavigation" }] })
    );
  };

  useEffect(() => {
    // fetch foods
    fetchTags().then((tags) => setTags(tags));
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerFont}>
            お気入り料理を{"\n"}
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
            selectionColor="#FFF"
            // caretHidden={true}
          ></TextInput>
          <View style={styles.searchBtn}>
            <TouchableOpacity onPress={() => {}}>
              <FontAwesome
                name="search"
                size={windowWidth * 0.07}
                color="#FFF"
              />
            </TouchableOpacity>
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
              <ToggleCard
                tag={item}
                checked={isChecked}
                onPressHandler={() => {
                  if (isChecked) {
                    setSelectedTag((prev) =>
                      prev.filter((id) => id !== item.id)
                    );
                  } else {
                    setSelectedTag((prev) => [...prev, item.id]);
                  }
                }}
              ></ToggleCard>
            );
          }}
        />
        {/* footer */}
        <Footer
          goBackFunc={() => navigation.goBack()}
          goNextFunc={() => settingComplete()}
          skipFunc={() => skipSetting()}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SelectFoodScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  header: {
    height: windowHeight * 0.12,
    width: windowWidth,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingLeft: windowWidth * 0.1,
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
});
