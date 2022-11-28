import { CommonActions, DrawerActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomHeader from "../../Components/HomeDrawer/CustomHeader";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { commonStyle } from "../../Style/CommonStyle";
import { SettingStackProps } from "../../Types/Home/Setting/SettingStackProps";
import { settingScreenConst } from "../../Constants/settingConst";
import { TipsContext } from "../../Context/TipsContext";
import { functionCategory } from "../../Constants/homeConst";

type SettingScreenProps = NativeStackScreenProps<
  SettingStackProps,
  "SettingScreen"
>;

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation, route }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={commonStyle.safeArea}>
        <TipsContext.Provider
          value={{ currentCategory: functionCategory.setting }}
        >
          <CustomHeader
            toggleMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          ></CustomHeader>
        </TipsContext.Provider>
        <View style={commonStyle.mainContainer}>
          <View style={[commonStyle.rowContainer]}>
            <Text style={[commonStyle.textContainer, commonStyle.titleText]}>
              {settingScreenConst.settingTitle}
            </Text>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.noticeSettingBut}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.displaySettingBut}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[commonStyle.rowContainer]}>
            <Text style={[commonStyle.textContainer, commonStyle.titleText, ,]}>
              {settingScreenConst.supportTitle}
            </Text>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.faqBut}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.recipeRequestBut}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[commonStyle.rowContainer]}>
            <Text style={[commonStyle.textContainer, commonStyle.titleText]}>
              {settingScreenConst.otherTitle}
            </Text>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.useRultBut}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.premiumUseRuleBut}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.postBut}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.privacyPolicyBut}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyle.rowContainer}>
            <TouchableOpacity
              style={commonStyle.button_disable}
              onPress={() => {}}
            >
              <Text
                style={[commonStyle.textContainer, commonStyle.subtitleText]}
              >
                {settingScreenConst.openSourceLicense}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SettingScreen;
