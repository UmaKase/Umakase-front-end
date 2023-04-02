import { TagCheck } from "../InitialSteps";

export type InitialStepsProps = {
  //Navigation
  HomeTabNavigation: undefined;
  //Screen
  IntroScreen: undefined;
  SelectTagScreen: undefined;
  SelectFoodScreen: {
    tags:TagCheck[];
    tagIds: string[];
  };
};
