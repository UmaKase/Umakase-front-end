import React, { memo }  from 'react'
import { FlatList } from 'react-native'
import { FoodCheck } from '../../Types/InitialSteps'

// FoodList input props type
type FoodListProps = {
  foods: FoodCheck[];
  onEndReached: () => void;
  renderItem: ({ item, index }: {
    item: FoodCheck;
    index: number;
  }) => JSX.Element;
  listFooterComponent: React.FC<{}>;
}
/**
 * FoodList component for FlatList 
 * this component 
 */
const FoodList:React.FC<FoodListProps> = memo(({foods, onEndReached, renderItem: renderItemFood, listFooterComponent: foodListFooterComponent}) => {
  return (
    <FlatList
      data={foods}
      keyExtractor={(item) => item.id.toString()}
      style={{flex:1}}
      columnWrapperStyle={{ justifyContent: "space-evenly" }}
      numColumns={2}
      renderItem={renderItemFood}
      ListFooterComponent={foodListFooterComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
    />
  )
})

export default FoodList