import React, { memo }  from 'react';
import { FlatList } from 'react-native';
import { FavoriteFoodInterface } from '../../../Types/InitialSteps';

// FoodList input props type
type FavoriteFoodListProps = {
  foods: FavoriteFoodInterface[];
  onEndReached: () => void;
  renderItem: ({ item, index }: {
    item: FavoriteFoodInterface;
    index: number;
  }) => JSX.Element;
  listFooterComponent: React.FC<{}>;
}
/**
 * FoodList component for FlatList 
 * this component 
 */
const FavoriteFoodList:React.FC<FavoriteFoodListProps> = memo(({foods, onEndReached, renderItem: renderItemFood, listFooterComponent: foodListFooterComponent}) => {
  return (
    <FlatList
      data={foods}
      keyExtractor={(item) => item.food.id.toString()}
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

export default FavoriteFoodList