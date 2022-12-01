import { createContext } from "react";
type TagContextProps = {
  contextTags: string[];
  setContextTags: (selectedTagsArray?: string[]) => void;
};

export const TagContext = createContext<TagContextProps>({
  contextTags: [],
  setContextTags: () => {},
});
