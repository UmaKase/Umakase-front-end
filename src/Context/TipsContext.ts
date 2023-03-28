import { functionCategory } from "../Constants/homeConst";
import { createContext } from "react";
interface ITipsContext {
    currentCategory:number    //
}
export const TipsContext = createContext<ITipsContext>({
  currentCategory:functionCategory.default,
});
