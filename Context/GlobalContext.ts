import { createContext } from "react";
export type CurrentRoomInfo = {
  name: string;
  id: string;
};
type GlobalContextProps = {
  currentRoomName: string;
  currentRoomId: string;
  setCurrentRoom: (inputRoom: CurrentRoomInfo) => void;
};

export const GlobalContext = createContext<GlobalContextProps>({
  currentRoomId: "not setting room id",
  currentRoomName: "not setting room name",
  setCurrentRoom: () => {
    console.log("not setting the set room function");
  },
});
