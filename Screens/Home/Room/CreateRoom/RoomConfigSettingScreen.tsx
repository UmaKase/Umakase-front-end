import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoomStackNavigationProps } from "../../../../Types/Navigations/HomeDrawer/RoomStack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../../../Components/HomeDrawer/CustomHeader";
import { DrawerActions } from "@react-navigation/native";
import {
  backgroundColor,
  paddingLarge,
  windowHeight,
  windowWidth,
} from "../../../../Constants/cssConst";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import SearchBar from "../../../../Components/InitialStep/SearchBar";
import _ from "lodash";
import customAxiosInstance from "../../../../Utils/customAxiosInstance";
import { RoomAPI } from "../../../../Constants/backendAPI";
import UserList from "../../../../Components/Home/UserList";
import { UserContext } from "../../../../Context/UserContext";
import { profileScreenStr } from "../../../../Constants/ProfileConst";
import { User } from "../../../../Types/types";
import CenterActivityIndicator from "../../../../Components/Universal/CenterActivityIndicator";

type RoomConfigSettingScreeProps = NativeStackScreenProps<
  RoomStackNavigationProps,
  "RoomConfigSettingScreen"
>;
const RoomConfigSettingScreen: React.FC<RoomConfigSettingScreeProps> = ({
  navigation,
}) => {
  const [fetching, setFetching] = useState(true);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [friends, setFriedns] = useState<User[]>([]);
  const [roomieNames, setRoomieNames] = useState<string[]>([]);

  // create room function
  const createRoom = async () => {
    await customAxiosInstance({
      method: "post",
      url: `${RoomAPI}/new`,
      data: {
        name: titleInput,
        roomieNames: [],
      },
    })
      .then((res) => {
        if (res.data) {
          navigation.pop();
        }
      })
      .catch((e) => {
        console.log(JSON.stringify(e.response));
        return Alert.alert("Create room failed.", `${e.response.error}`);
      });
  };

  // search mode
  // const [searchMode, setSearchMode] = useState(false);
  // const [searchInput, setSearchInput] = useState("");
  // const searchOn = () => {
  //   setSearchMode(true);
  // };
  // const leaveSearchMode = () => {
  //   setSearchMode(false);
  // };
  // const searchFriend = useCallback(
  //   _.debounce((input: string) => {
  //     console.log(input);
  //   }, 500),
  //   []
  // );

  useEffect(() => {
    console.log("hi this is set room config screen.");
    setFriedns(fakeUserData);
    setFetching(false);
    return () => {
      console.log("see u next time :D");
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.background}>
        <CustomHeader
          toggleMenu={() => navigation.dispatch(DrawerActions.openDrawer)}
        ></CustomHeader>
        {/* title header  ================================================================ */}
        <View style={styles.title}>
          {/* prettier-ignore */}
          <Text style={{fontSize:windowWidth*0.08, color:"#FFF", fontWeight:"500"}}>タイトル</Text>
          <TouchableOpacity
            onPress={() => {
              console.log("this is setting btn");
            }}
          >
            {/* prettier-ignore */}
            <FontAwesome5
            name="trash"
            size={windowWidth * 0.1}
            color="#FFF"
          />
          </TouchableOpacity>
        </View>
        {/* title input  ================================================================  */}
        <TextInput
          style={styles.titleInput}
          value={titleInput}
          onChangeText={(value) => setTitleInput(value)}
          selectionColor="#FFF"
          caretHidden={true}
        ></TextInput>
        {/* description  */}
        <View style={styles.title}>
          <Text
            style={{
              fontSize: windowWidth * 0.08,
              color: "#FFF",
              fontWeight: "500",
            }}
          >
            説明
          </Text>
        </View>
        <TextInput
          style={styles.titleInput}
          value={descriptionInput}
          onChangeText={(value) => setDescriptionInput(value)}
          selectionColor="#FFF"
          caretHidden={true}
        ></TextInput>
        {/* member picking ======================================================== */}
        {/* <View style={styles.title}>
          <Text
            style={{
              fontSize: windowWidth * 0.08,
              color: "#FFF",
              fontWeight: "500",
            }}
          >
            参加者を選択
          </Text>
          <TouchableOpacity
            onPress={() => {
              searchOn();
              console.log("this is plus button!");
            }}
          >
            <FontAwesome5
              name="plus-circle"
              size={windowWidth * 0.12}
              color="#FFF"
            />
          </TouchableOpacity>
        </View> */}
        {/* member list =================*/}
        <View style={{ flex: 1 }}>
          {fetching ? (
            <CenterActivityIndicator size="large" color="#FFF" />
          ) : (
            <UserContext.Provider
              value={{
                users: friends,
                headerTitle: profileScreenStr.userListHeaderText,
                handleRemove: (user: User) => {
                  console.log(user.id);
                },
                handleSelect: () => {},
              }}
            >
              <UserList />
            </UserContext.Provider>
          )}
        </View>
        {/* footer ================================================================ */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <FontAwesome name="home" size={windowWidth * 0.12} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => createRoom()}>
            <FontAwesome
              name="arrow-circle-right"
              size={windowWidth * 0.12}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
        {/* search modal =================================================== */}
        {/* <Modal
          isVisible={searchMode}
          onBackdropPress={() => leaveSearchMode()}
          style={{ margin: 0, justifyContent: "flex-end" }}
        >
          <View style={styles.modal}>
            <SearchBar
              input={searchInput}
              setInput={setSearchInput}
              placeholderText="Enter user name"
              searchFunction={(input: string) => searchFriend(input)}
            />
          </View>
        </Modal> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RoomConfigSettingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: "center",
  },
  // title part
  title: {
    height: windowHeight * 0.077,
    width: windowWidth * 0.9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: windowWidth * 0.01,
    marginVertical: windowWidth * 0.03,
  },
  titleInput: {
    height: windowHeight * 0.077,
    width: windowWidth * 0.9,
    paddingHorizontal: windowWidth * 0.02,
    fontSize: windowWidth * 0.08,
    textAlign: "center",
    backgroundColor: "#ECAC72",
    color: "#FFF",
  },

  // desscription part
  descriptionInpit: {
    height: windowHeight * 0.13,
    width: windowWidth * 0.9,
    paddingHorizontal: windowWidth * 0.02,
    fontSize: windowWidth * 0.08,
    textAlign: "center",
    backgroundColor: "#ECAC72",
    color: "#FFF",
  },

  // footer
  footer: {
    height: windowHeight * 0.07,
    width: windowWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: paddingLarge,
    marginTop: windowWidth * 0.01,
  },
  // modal
  modal: {
    flex: 0.75,
    backgroundColor: "#FFF",
    borderTopLeftRadius: windowWidth * 0.05,
    borderTopRightRadius: windowWidth * 0.05,
  },
});

const fakeUserData = [
  {
    id: "molestiae distinctio dolor",
    createdAt:
      "Error quae illo earum. Accusamus adipisci non maiores et. Quibusdam dolor ad. Ut quae quisquam veritatis reiciendis sed. Sint deserunt incidunt consequuntur quidem voluptatem deleniti.",
    updatedAt:
      "Ut repellendus hic qui sunt voluptatem. Consequatur omnis quis delectus est nostrum delectus ipsum rerum sapiente. Sapiente sapiente qui et veniam sed reiciendis cupiditate aut placeat. Amet nam non. Error voluptas rerum ab.",
    email: "0#LT_<1pma",
    password: "et",
    refreshToken: "^h@EZz&l:d",
    tmpId: "']rZO;e%P*",
  },
  {
    id: "Dicta in praesentium sit porro id nam est rerum provident.",
    createdAt:
      "Quia aut consequatur. Molestiae ullam quia corporis quasi qui nesciunt qui corporis. Eaque commodi dolorum cum illum totam.",
    updatedAt:
      "Consequatur beatae provident unde. Totam qui incidunt ipsum blanditiis magnam. Aut possimus deleniti aliquam consequatur voluptate delectus incidunt sit. Qui repellendus accusamus dolorem sunt sint.\n \rVoluptatibus nemo ea quo ab ea enim sunt debitis. Deserunt rerum voluptate aliquid. Ut velit rem porro impedit eos et soluta voluptate debitis. Adipisci ab dolores vitae repudiandae blanditiis itaque eos qui adipisci. Et quas numquam a placeat odio amet.\n \rQui dolor qui dignissimos sit fugiat. Qui atque corrupti molestias et suscipit officia et id. Minus quasi explicabo enim dolores magnam et. Tempore libero velit. Placeat magnam natus reprehenderit. Delectus nihil laboriosam eaque aut suscipit ducimus.",
    email: "J]V}4xb[a;",
    password: "Ut sed est vel assumenda itaque et.",
    refreshToken: "?R-&\\yT>j|",
    tmpId: ";yV|;X,i`O",
  },
  {
    id: "Rem molestiae numquam id est. Architecto repellat sint consectetur voluptatem similique voluptas. Minima aspernatur nihil nemo culpa sed esse minus eos. Neque deserunt sint vero aut autem. Distinctio eveniet maiores. Enim aut sed tenetur officiis rerum temporibus adipisci.",
    createdAt:
      "Quidem et atque in enim laudantium nisi. Voluptates molestias aut enim. Itaque quia perferendis a quia. Autem quis magni at labore veniam voluptatum. Quibusdam aspernatur sit aut deleniti. Autem inventore et architecto sit aut odit eos et ad.\n \rEa nesciunt amet aut fugiat. Veniam ut omnis. Animi temporibus et neque laboriosam accusamus qui ducimus harum est.\n \rArchitecto quia cumque voluptatem enim consequatur consequatur. Nostrum dolor fugit in nesciunt ex. Nisi molestias perferendis omnis et possimus id sint. Exercitationem eos at sunt eius est quae praesentium et.",
    updatedAt: "Occaecati deleniti enim illo eum.",
    email: 'H:,}bU"Y-0',
    password: "Ut quia eum voluptatem nemo.",
    refreshToken: "+C,|J_EO)`",
    tmpId: "Wh}R`:hqCR",
  },
  // {
  //   id: "aspernatur",
  //   createdAt:
  //     "Debitis enim totam doloremque velit. Voluptas harum nam sit totam quam ut voluptates vitae dolor. Beatae et exercitationem dolorum. Quae iure quos autem minus debitis iusto et et alias. At sed quia est consequatur voluptatum autem sit qui. Molestiae corporis nemo perferendis et perferendis eum ut aliquam.\n \rEt mollitia eaque quasi id at. Omnis occaecati aliquam inventore ducimus vitae. Et tempore ducimus voluptatem nam in tempora sit sed et.\n \rVoluptatem beatae optio provident officia facilis hic quaerat in at. Voluptates ea ut ratione odit perspiciatis et et. Explicabo et ducimus temporibus labore repellendus. Voluptatem id sed. Ipsam numquam consequatur et culpa eaque nostrum accusamus alias possimus.",
  //   updatedAt:
  //     "Omnis rerum quo reprehenderit maiores provident architecto quasi commodi voluptatem.",
  //   email: '}[3q1XFz"q',
  //   password: "nostrum",
  //   refreshToken: "3R@TUZK(Zh",
  //   tmpId: "'f6|)I/@s;",
  // },
  // {
  //   id: "Ad cumque sunt magni rerum. Nisi non nostrum perferendis qui. Consequuntur ut quia et a unde. Optio ea qui illo sint eius dolorem aperiam ut.\n \rNisi fugit autem consequatur corrupti blanditiis. Expedita expedita labore. Fuga nostrum id repudiandae fugit enim et ut. Omnis ratione corrupti enim nihil fugiat eius et minima reiciendis. Quis repellendus voluptate nihil enim ducimus molestias quae unde sunt. Fugit vero vel dolores sint exercitationem facere dolorem omnis modi.\n \rConsectetur atque similique odit facilis iste qui. Culpa et est. Distinctio et libero aut aliquid sit.",
  //   createdAt: "Ex officiis sapiente dolor veniam est.",
  //   updatedAt: "et",
  //   email: "w.jZTg}C1U",
  //   password:
  //     "Est non dolor aut quia veniam praesentium dolorem voluptate. Accusantium omnis error facere veniam cupiditate. Numquam doloribus aut ipsam sint dolorum dolor delectus vel.",
  //   refreshToken: "CPvm(GO'*|",
  //   tmpId: "K2aSP6=OwD",
  // },
  // {
  //   id: "Illo est quibusdam et dolor. Voluptas quis nulla ut excepturi est explicabo harum qui.",
  //   createdAt: "sunt",
  //   updatedAt: "est nobis odit",
  //   email: "s1XgY(K<pZ",
  //   password: "Maiores similique iste.",
  //   refreshToken: "'M9a%cQ'BK",
  //   tmpId: "S01x1DDTXU",
  // },
  // {
  //   id: "Asperiores alias ut non ex vero.\nEt autem fuga natus odit et sit.\nReiciendis doloremque earum et hic facere unde quo.\nNesciunt nihil eveniet iure sint quo dolores porro hic.\nExercitationem ut molestiae repellendus nisi.",
  //   createdAt:
  //     "Aliquid dicta ex ullam in sit non. Et delectus commodi corporis aliquam quia qui vel praesentium.",
  //   updatedAt:
  //     "Inventore eum commodi molestias quo ratione ut maiores aut. Omnis ratione autem. Nobis sint commodi corporis labore dolores unde esse iure. Dolorem quo ut impedit sit nemo sapiente rerum.",
  //   email: "6.<#a4kJ=H",
  //   password: "Nihil nulla vitae repudiandae. Voluptatibus sapiente sed qui.",
  //   refreshToken: "W]tw[iy&Jx",
  //   tmpId: '"J0iMQ3JyA',
  // },
  // {
  //   id: "Commodi eos sit molestias qui et voluptas cumque nihil dicta. Qui consequatur alias omnis quis officia temporibus.",
  //   createdAt: "cumque",
  //   updatedAt: "odio",
  //   email: "AVadtT+d6P",
  //   password:
  //     "Voluptas explicabo error eos vel cumque atque voluptatem aut. Soluta qui excepturi id facilis maiores voluptas. At quo atque corporis minus. Odit beatae minus architecto.\n \rId eveniet dignissimos ut voluptate labore veniam in. Rem eveniet ea. Laudantium culpa in enim repudiandae beatae. Alias sit error possimus hic aut unde. Deleniti perferendis magnam doloribus sed. Dolore perferendis ducimus ut sunt et.\n \rEt et dolor. Et id veritatis quo consequatur voluptas. Eaque ea excepturi. Amet ullam voluptatem reprehenderit est facilis maxime minima. Ex et quos voluptatem ea debitis earum est nam. Id recusandae expedita cupiditate voluptatem.",
  //   refreshToken: "AuH`S=#@6D",
  //   tmpId: "FH8wI[,cd{",
  // },
  // {
  //   id: "Impedit vitae reiciendis commodi maiores esse quo in. Numquam culpa dolores architecto sunt ut. Qui sint omnis distinctio explicabo voluptatibus accusantium ut. Ut qui doloribus sunt fugiat est voluptatem veniam. Repellendus nihil nam. Ab et inventore.",
  //   createdAt: "Et velit earum distinctio et.",
  //   updatedAt:
  //     "Beatae earum iusto nihil aspernatur debitis dolorum eaque. Quia rerum est voluptatem saepe corporis rerum et facilis aut. Voluptas et deserunt et deserunt dolores rerum. Aut magnam placeat est unde voluptatem tempore qui odit eum.",
  //   email: "_P|-vuv<mm",
  //   password: "placeat delectus explicabo",
  //   refreshToken: "ZQ_iW\\]xk0",
  //   tmpId: "))K7']yh4/",
  // },
  // {
  //   id: "Voluptas quos doloribus facilis quae nihil distinctio sint dolor nesciunt.",
  //   createdAt: "libero",
  //   updatedAt: "Est suscipit consequatur.\nRatione natus animi iure et qui ab.",
  //   email: "&nFqyzHwOT",
  //   password: "Consequatur est dolore velit sed.",
  //   refreshToken: "a:3/ePbC5<",
  //   tmpId: "mlm6i(D$)Z",
  // },
];
