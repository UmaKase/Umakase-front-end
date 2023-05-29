//business logic
import React from "react";
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import { AxiosError, AxiosResponse } from "axios";
import customAxiosInstance from "../../../Utils/customAxiosInstance";
//layout control
import CustomHeader from "../../../Components/HomeDrawer/CustomHeader";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TipsContext } from "../../../Context/TipsContext";
import { commonStyle } from "../../../Style/CommonStyle";
import { errorPopUp } from "../../../Components/Universal/AlertControl";
//props
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SettingStackProps } from "../../../Types/Home/Setting/SettingStackProps";
//UI
import { RadioButton } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
//constant
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { functionCategory } from "../../../Constants/homeConst";
import { drawerColor, lightTextColor, paddingLarge, windowHeight, windowWidth } from "../../../Constants/cssConst";
import { reportScreenConst } from "../../../Constants/settingConst";
import { FeedbackAPI } from "../../../Constants/backendAPI";

type ReportScreenProps = NativeStackScreenProps<SettingStackProps, "SettingScreen">;
const ReportScreen: React.FC<ReportScreenProps> = ({ navigation, route }) => {
  const [typeChecked, setTypeChecked] = React.useState("comment");
  const [reportComment, setReportComment] = React.useState("");
  //submit feedback function
  const postFeedback = (successCallBack: (res: AxiosResponse) => void, failCallback: (res: Error | AxiosError) => void) => {
    customAxiosInstance({
      method: "post",
      url: `${FeedbackAPI}/`,
      data: {
        reportDate: new Date(),
        version: "0.0.1",
        label: typeChecked,
        contents: reportComment,
      },
    })
      .then((res) => {
        successCallBack(res);
      })
      .catch((e) => {
        failCallback(e);
      });
  };
  //if user go back to this page, it will redirect to setting page
  useFocusEffect(
    React.useCallback(() => {
      return () => navigation.reset;
    }, [])
  );
  //redirct to the previous page when the feedback is submited
  const successCallBack = (res: AxiosResponse) => {
    navigation.goBack();
  };
  //show error pop up when the feedback cannot be submited
  const failCallback = (res: Error | AxiosError) => {
    errorPopUp("E0121");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={commonStyle.safeArea}>
        <TipsContext.Provider value={{ currentCategory: functionCategory.setting }}>
          <CustomHeader toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}></CustomHeader>
        </TipsContext.Provider>
        <View style={commonStyle.mainContainer}>
          <View style={[commonStyle.rowContainer, commonStyle.titleContainer]}>
            <Text style={[commonStyle.textContainer, commonStyle.titleText]}>{reportScreenConst.reportTitle}</Text>
          </View>
          <View style={[commonStyle.rowContainer, commonStyle.blockContainer]}>
            <Text style={[commonStyle.textContainer, , { textAlign: "left" }]}>{reportScreenConst.reportDesc}</Text>
          </View>
          <View style={[commonStyle.rowContainer, , commonStyle.blockContainer, { justifyContent: "flex-start" }]}>
            <RadioButton.Group onValueChange={(newValue) => setTypeChecked(newValue)} value={typeChecked}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton value="comment" />
                <Text style={[commonStyle.textContainer, { alignItems: "center" }]}>ご意見・ご要望</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton value="bug" />
                <Text style={[commonStyle.textContainer, { alignItems: "center" }]}>機能不具合</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton value="report" />
                <Text style={[commonStyle.textContainer, { alignItems: "center" }]}>投稿への報告</Text>
              </View>
            </RadioButton.Group>
          </View>
          <View style={[commonStyle.rowContainer, , commonStyle.blockContainer, { height: windowHeight * 0.06 }]}>
            <TextInput style={styles.textbox} placeholder={reportScreenConst.reportTextHint} value={reportComment} multiline={true} numberOfLines={4} onChangeText={setReportComment}></TextInput>
          </View>
        </View>
        <View style={[commonStyle.footer]}>
          <View style={commonStyle.sideContainer}>
            <TouchableOpacity
              style={[styles.modeBtn]}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <FontAwesome name="arrow-left" size={windowWidth * 0.09} color={lightTextColor} />
            </TouchableOpacity>
          </View>
          <View style={commonStyle.sideContainer}>
            <TouchableOpacity
              style={[styles.modeBtn]}
              onPress={() => {
                //comment textbox cannot be empty
                if (reportComment == "") errorPopUp("E0122");
                else postFeedback(successCallBack, failCallback);
              }}
            >
              <FontAwesome name="check" size={windowWidth * 0.09} color={lightTextColor} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ReportScreen;

const buttonSize = windowWidth * 0.17;
const styles = StyleSheet.create({
  sideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  formRowContainer: {
    paddingLeft: paddingLarge,
    marginTop: paddingLarge,
  },
  textbox: {
    width: windowWidth,
    height: windowHeight * 0.2,
    flex: 0.9,
    color: lightTextColor,
    borderBottomWidth: 1,
    backgroundColor: drawerColor,
    textAlignVertical: "top",
  },
  modeBtn: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    marginHorizontal: windowWidth * 0.02,
    borderWidth: 5,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
