import { createContext } from "react";
type TagContextProps = {
  contextTags: string[];
  setContextTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export const TagContext = createContext<TagContextProps>({
  contextTags: [],
  setContextTags: () => {},
});
