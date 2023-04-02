import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { windowWidth, windowHeight } from '../../Constants/cssConst'

type Props = {
  loadingText: "Creating new account" | "Login process";
}

const SubmitStatus:React.FC<Props> = ({loadingText}) => {
  return (
    <View>
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
    </View>
  )
}

export default SubmitStatus