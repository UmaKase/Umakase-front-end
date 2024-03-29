//define screens of Profile stack
export type ProfileStackProps = {
  //screens
  ProfileScreen: undefined;
  ProfileUpdateScreen: {
    mode:number;
    userId:string;
    userName:string;
    firstName?:string;
    lastName?:string;
    setFirstName?:React.Dispatch<React.SetStateAction<string>>;
    setLastName?:React.Dispatch<React.SetStateAction<string>>;
  };
  RegisterScreen:undefined;
  LoginScreen:undefined;
};
