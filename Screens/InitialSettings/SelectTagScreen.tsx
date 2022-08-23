import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InitialStepsProps } from "../../types/Navigations/InitialSteps";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ToggleCard from "../../Components/InitialStep/ToggleCard";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../Constants/cssConst";
import { Tag } from "../../types/InitialSteps/Tag";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { USERNAME_KEY } from "../../Constants/securestoreKey";
import { TagAPI } from "../../Constants/backendAPI";
import { FlatList } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<InitialStepsProps, "SelectTagScreen">;

const SelectTagScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
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
          <Text style={styles.headerFont}>choose the tag you want</Text>
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
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SelectFoodScreen")}
            style={styles.button}
          >
            <Text style={styles.buttonFont}>skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() => navigation.navigate("SelectFoodScreen")}
            onPress={() => getTags()}
            style={styles.button}
          >
            <Text style={styles.buttonFont}>get tags</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonFont}>submit</Text>
          </TouchableOpacity>
        </View>
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
    height: windowHeight * 0.1,
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  headerFont: {
    fontSize: windowWidth * 0.08,
    color: "#FFF",
  },
  cardContainer: {
    height: windowHeight * 0.8,
  },
  singleTag: {
    height: 50,
    width: 200,
    borderWidth: 1,
    borderColor: "red",
    marginVertical: 10,
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
