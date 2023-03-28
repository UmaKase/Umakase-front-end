import { ActivityIndicator, Text, View } from 'react-native'
import React from 'react'
import { windowHeight } from '../../Constants/cssConst';

// type of ListFooterComponent input
type Props = {
  reachedEnd: boolean;
  reachedEndText: string;
}
const ListFooterComponent: React.FC<Props> = ({ reachedEnd, reachedEndText }) => {
  return (
    <View style={{ height: windowHeight * 0.1, alignItems: "center", justifyContent: "center" }}>
      {
        reachedEnd ? <Text style={{ color: "#FFF" }}>{reachedEndText}</Text> :
          <ActivityIndicator size="large" color={"#FFF"} />
      }
    </View>
  )
}

export default ListFooterComponent