import { TagCheck } from "../InitialSteps";

export type InitialStepsProps = {
  //Navigation
  HomeTabNavigation: undefined;
  //Screen
  IntroScreen: undefined;
  SelectTagScreen: undefined;
  SelectFoodScreen: {
    selectAll: boolean;
    tags:TagCheck[];
    tagIds: string[];
  };
};
