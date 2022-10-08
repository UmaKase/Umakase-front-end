import { ProfileStackProps } from "Types/Home/Profile/ProfileStackProps";

export type HomeDrawerNavigationProps = {
  //screens
  RandomScreen: undefined;
  ProfileNavigation:{
    ProfileScreen: undefined;
    ProfileUpdateScreen:ProfileStackProps;
  };
  Room: undefined;
};
