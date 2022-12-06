import { ProfileStackProps } from "Types/Home/Profile/ProfileStackProps";
import { DrawerLabel } from "../../Constants/homeConst";
export type HomeDrawerNavigationProps = {
  //screens
  RandomScreen: undefined;
  ProfileNavigation: {
    ProfileScreen: undefined;
    ProfileUpdateScreen: ProfileStackProps;
  };
  SettingNavigation: {
    SettingScreen: undefined;
  };
  Room: undefined;
  BookmarkedStackNavigation: undefined;
};
