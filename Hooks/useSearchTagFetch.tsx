import { useCallback, useEffect, useState } from "react";
import normalAxios from "../Utils/normalAxios";
import { TagAPI } from "../Constants/backendAPI";
import { TagCheck } from "../Types/InitialSteps";
import { debounce, DebouncedFunc } from "lodash";

type useSearchTagFetchResponse = [
  searchModeController: {
    searchMode: boolean;
    searchModeStart: () => void;
    searchModeEnd: () => void;
  },
  searchTagController: {
    searchTags: TagCheck[];
    setSearchTags: React.Dispatch<React.SetStateAction<TagCheck[]>>;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    debounceSearchFunction: DebouncedFunc<(userInput: string) => void>;
    searchPageAdd: () => void;
  }
]

export default function useSearchTagFetch(tags: TagCheck[]): useSearchTagFetchResponse {
  // NOTE Search mode controller
  const [searchMode, setSearchMode] = useState(false);
  const [searchTags, setSearchTags] = useState<TagCheck[]>([]);
  const [input, setInput] = useState<string>("");
  const [searchPage, setSearchPage] = useState(1);
  const [searchPageEnd, setSearchPageEnd] = useState(false);

  // SECTION fetch search tags
  async function fetchSearchTags(userInput?: string) {
    const response = await normalAxios({
      method: "post",
      url: `${TagAPI}/search?name=${userInput ?? input}&take=20&page=${searchPage}`,
      data: {
        excludes: [],
      },
    });

    // NOTE check if the list reached the end
    if (response.data.data.tags.length <= 0) {
      setSearchPageEnd(true);
      return;
    }

    // pre process response
    const preProcessResponse = response.data.data.tags.map((searchTag: TagCheck) => {
      const tagAlreadyInList = tags.find((tag) => tag.id === searchTag.id);
      searchTag.checked = tagAlreadyInList?.checked ?? false;
      return searchTag;
    })

    // combine the new response with the previous state
    setSearchTags((prev) => {
      const newState = [...prev, ...preProcessResponse];
      return newState;
    })
  }
  // !SECTION =====================================================================================

  // SECTION debounce search tag function
  const debounceSearchFunction = useCallback(
    debounce((userInput: string) => {
      // NOTE reset search page and search page end
      setSearchPage(1);
      setSearchTags([]);
      setSearchPageEnd(false);

      // NOTE check input is empty or not before fetch search tags
      if (userInput !== "") {
        fetchSearchTags(userInput);
      }
    }, 500),
    [tags],
  )

  // !SECTION



  // ANCHOR useEffect 
  useEffect(() => {
    if (searchPage !== 1 && !searchPageEnd) {
      fetchSearchTags();
    }
  }, [searchPage])

  // SECTION wrap states & functions with object
  const searchModeController = {
    searchMode: searchMode,
    searchModeStart: () => { setSearchMode(true) },
    searchModeEnd: () => { setSearchMode(false) }
  }
  const searchTagController = {
    searchTags: searchTags,
    setSearchTags: setSearchTags,
    input: input,
    setInput: setInput,
    debounceSearchFunction: debounceSearchFunction,
    searchPageAdd: () => { setSearchPage((prev) => prev + 1) },
  }
  // !SECTION 

  return [searchModeController, searchTagController];
}