import { createContext } from "react";
interface IProfileContext {
    lastName:string,
    firstName:string,
    setLastName?:React.Dispatch<React.SetStateAction<string>>,
    setFirstName?:React.Dispatch<React.SetStateAction<string>>
}
export const ProfileContext = createContext<IProfileContext>({
  lastName:"",
  firstName:"",
});
