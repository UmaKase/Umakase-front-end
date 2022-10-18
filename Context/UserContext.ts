import { createContext } from "react";
import { GestureResponderEvent } from "react-native";
import { User } from "Types/types";
interface IUserContext {
  users:User[],                           //User display into the list
  headerTitle:string,                     //Display text showed in the list header
  handleAdd?:(roomID:string) => void;      //Event for Add button in the header
  handleRemove?: (key: string) => void;    //Event for Remove button in user items
  handleSelect?:(key:string) => void;      //Event for selecting user item
}
export const UserContext = createContext<IUserContext>({
  users:[],
  headerTitle:"",
});
