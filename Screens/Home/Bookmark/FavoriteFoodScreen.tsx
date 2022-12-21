import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookmarkedStackProps } from "../../../Types/Navigations/HomeDrawer/BookmarkedStack";
import Background from "../../../Components/Universal/Background";
import SearchBarForBookMark from "../../../Components/Home/Bookmark/SearchBarForBookMark";
import {
  backgroundColor,
  windowHeight,
  windowWidth,
} from "../../../Constants/cssConst";
import ControlBar from "../../../Components/Home/Bookmark/ControlBar";
import { BookMarkFood, Food, FoodsList } from "../../../Types/InitialSteps";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
import ToggleFood from "../../../Components/InitialStep/ToggleFood";
import { FoodAPI, RoomAPI } from "../../../Constants/backendAPI";
import CenterActivityIndicator from "../../../Components/Universal/CenterActivityIndicator";
import Modal from "react-native-modal";
import axios from "axios";
import _ from "lodash";
import ToggleFoodForSearch from "../../../Components/InitialStep/ToggleFoodForSearch";
import SearchBar from "../../../Components/InitialStep/SearchBar";
import Footer from "../../../Components/InitialStep/Footer";

type Props = NativeStackScreenProps<BookmarkedStackProps, "FavoriteFoodScreen">;
const FavoriteFoodScreen: React.FC<Props> = ({ route, navigation }) => {
  //ANCHOR context
  // const { contextTags, setContextTags } = useContext(TagContext);
  // console.log(contextTags);
  //ANCHOR fetching state
  const [fetching, setFetching] = useState(true);
  //ANCHOR go SearchTagScreen
  const optionHandler = () => {
    navigation.navigate("SearchFoodTagScreen", {
      tags: food.map((food) => food.name),
    });
  };
  //ANCHOR favorive food mode ================================
  const [favMode, setFavMode] = useState<boolean>(true);

  // SECTION initial loading
  //ANCHOR food ==============================================
  // screen foods state
  const [food, setFood] = useState<Food[]>([]);
  const [showFood, setShowFood] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);

  // ANCHOR local search
  // search text input
  const [searchInput, setSearchInput] = useState("");
  // search food function
  const localSearchFunction = (input: string) => {
    console.log(input);
    if (input === "") {
      setShowFood(food);
    } else {
      const filteredFood = food.filter((item) => {
        if (item.name.includes(input)) {
          return item;
        }
        return;
      });
      setShowFood(filteredFood);
    }
  };

  // get personal foods
  useEffect(() => {
    customAxiosInstance({
      method: "get",
      url: `${FoodAPI}/default`,
    })
      .then((res) => {
        console.log(res.data.data.foods.map((item: FoodsList) => item.food));
        setFood(res.data.data.foods.map((item: FoodsList) => item.food));
        setShowFood(res.data.data.foods.map((item: FoodsList) => item.food));
        setFetching(false);
      })
      .catch((e) => {
        console.log(e.response.status);
      });
    return () => {};
  }, []);
  // !SECTION

  // SECTION Modal
  // modal search mode
  const [searchMode, setSearchMode] = useState(false);
  // modal food state
  const [modalFood, setModalFood] = useState<BookMarkFood[]>([]);
  const [modalSelectedFood, setModalSelectedFood] = useState<string[]>([]);
  // modal search input
  const [modalInputText, setModalInputText] = useState("");
  // modal foods page
  const [modalPage, setModalPage] = useState(1);
  const [modalFoodEnd, setModalFoodEnd] = useState(false);

  // search Food function
  // search food
  const debounceSearchFood = useCallback(
    _.debounce(async (input: string) => {
      if (input === "") {
        setModalFood([]);
        setModalPage(1);
      } else {
        axios({
          method: "post",
          url: `${FoodAPI}/db?name=${input}&take=20&page=${modalPage}`,
          data: {
            excludeFoods: [...food.map((item) => item.id)],
          },
        })
          .then((res) => {
            setModalFood(res.data.data.foods);
          })
          .catch((e) => console.log("food request error:", e));
      }
      console.log(input);
    }, 500),
    []
  );

  // search modal on reached end handler
  const onModalScrollToBottom = () => {
    console.log("modal reach end");
    setModalPage((prev) => prev + 1);
  };

  // search food on reachedend handler
  useEffect(() => {
    if (modalPage !== 1 && !modalFoodEnd) {
      axios({
        url: `${FoodAPI}/db?name=${modalInputText}&take=20&page=${modalPage}`,
        method: "post",
        data: {
          excludeFoods: [...food.map((item) => item.id), ...modalSelectedFood],
        },
      })
        .then((res) => {
          if (res.data.data.foods[0]) {
            console.log(res.data.data.foods);
            setModalFood((prev) => [...prev, ...res.data.data.foods]);
          } else {
            setModalFoodEnd(true);
          }
        })
        .catch((e) => console.log(e.response));
    } else {
      setModalFoodEnd(true);
    }
  }, [modalPage]);

  // useCallback to return renderItem for flatlist
  // const mainScreenFoods = useCallback(
  //   (item: Food, index: number, flag: boolean) => {
  //     console.log(flag);
  //     return (
  //       <ToggleFood
  //         key={index.toString()}
  //         food={item}
  //         checked={flag}
  //         onPressHandler={() => {
  //           if (flag) {
  //             console.log("now is true.");
  //             setSelectedFood((prev) => prev.filter((id) => id !== item.id));
  //           } else {
  //             console.log("now is false.");
  //             setSelectedFood((prev) => [...prev, item.id]);
  //           }
  //         }}
  //       />
  //     );
  //   },
  //   []
  // );
  // foodcard
  const mainScreenFoods = (info: ListRenderItemInfo<Food>) => {
    const { item, index } = info;
    let flag = selectedFood.find((selectedFood) => selectedFood === item.id)
      ? true
      : false;
    return (
      <ToggleFood
        key={index.toString()}
        food={item}
        checked={flag}
        onPressHandler={() => {
          if (flag) {
            console.log("now is true.");
            setSelectedFood((prev) => prev.filter((id) => id !== item.id));
          } else {
            console.log("now is false.");
            setSelectedFood((prev) => [...prev, item.id]);
          }
        }}
      />
    );
  };

  //
  // TODO update room's food library
  const updateFoodHandler = () => {
    customAxiosInstance({
      url: `${RoomAPI}/update/`,
      data: {
        event: "update",
        foods: modalSelectedFood,
      },
    });
  };

  // leave search mode
  const leaveSearchMode = () => {
    setSearchMode(false);
    setModalInputText("");
    setModalFood([]);
    setModalPage(1);
    console.log("leave search mode");
  };
  // // !SECTION

  // delete food button action
  const deleteFoodHandler = () => {};

  return (
    <Background>
      {/* search bar */}
      <SearchBarForBookMark
        input={searchInput}
        setInput={setSearchInput}
        searchFunction={localSearchFunction}
        placeholderText="料理名、食材を入力してください"
      ></SearchBarForBookMark>
      {/* control bar */}
      <ControlBar
        favMode={favMode}
        setFavMode={setFavMode}
        // handleAdd={() => setModalSearchMode(true)}
        handleAdd={() => setSearchMode(true)}
        handleTrash={() =>
          Alert.alert("notify", "Do you want to delete the food from list?", [
            {
              text: "Yes",
              onPress: () => deleteFoodHandler(),
              style: "default",
            },
          ])
        }
        toggleFlag={selectedFood.length === 0}
      />
      {/* food cards */}
      {fetching ? (
        <CenterActivityIndicator size={"large"} color="#FFF" />
      ) : (
        <FlatList
          data={showFood}
          // keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1 }}
          columnWrapperStyle={{ justifyContent: "space-evenly" }}
          numColumns={2}
          renderItem={mainScreenFoods}
        />
      )}
      {/* footer ===================== */}
      {/* <View style={styles.footerContainer}>
        
      </View> */}
      <Footer
        goBackFunc={() => navigation.goBack()}
        goNextFunc={() => console.log("no next step so far.")}
        skipFunc={() => console.log("no skip function.")}
      />
      {/* <TouchableOpacity
        onPress={() => optionHandler()}
        style={{
          marginTop: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: paddingMedium,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: textLarge,
            fontWeight: "600",
            color: lightTextColor,
            position: "relative",
            top: 10,
          }}
        >
          オプション
        </Text>
        <FontAwesome
          name="angle-double-down"
          size={windowWidth * 0.12}
          color={lightTextColor}
        />
      </TouchableOpacity> */}
      {searchMode ? (
        <Modal
          isVisible={searchMode}
          style={styles.modal}
          onBackdropPress={leaveSearchMode}
        >
          <View style={styles.modalBackground}>
            {/* ANCHOR search bar */}
            <SearchBar
              input={modalInputText}
              setInput={setModalInputText}
              placeholderText={"find food"}
              searchFunction={(input: string) => debounceSearchFood(input)}
            />
            {/* ANCHOR toggleFoods */}
            <FlatList
              data={modalFood}
              keyExtractor={(item, index) => index.toString()}
              style={{ flex: 1 }}
              columnWrapperStyle={{ justifyContent: "space-evenly" }}
              numColumns={2}
              onEndReached={() => onModalScrollToBottom()}
              renderItem={({ item, index }) => {
                let checkFlag = modalSelectedFood.find(
                  (selectedFood) => selectedFood === item.id
                )
                  ? true
                  : false;
                return (
                  <ToggleFoodForSearch
                    key={index.toString()}
                    food={item}
                    checked={checkFlag}
                    onPressHandler={() => {
                      const tempFood = modalFood[index];
                      if (checkFlag) {
                        setModalSelectedFood((prev) =>
                          prev.filter((id) => id !== item.id)
                        );
                      } else {
                        setModalSelectedFood((prev) => [...prev, item.id]);
                        setModalFood((prev) => [
                          tempFood,
                          ...prev.filter((food) => {
                            food.id !== tempFood.id;
                          }),
                        ]);
                      }
                    }}
                  />
                );
              }}
            />
            {/* ANCHOR modal footer */}
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
      ) : (
        <></>
      )}
    </Background>
  );
};

export default FavoriteFoodScreen;

const styles = StyleSheet.create({
  // footer
  footerContainer: {
    width: windowWidth,
    height: windowHeight * 0.1,
    borderWidth: 1,
  },

  // modal
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
