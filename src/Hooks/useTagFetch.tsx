// official import
import { useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";
// custom import
import { TagAPI } from "../Constants/backendAPI";
import { INITIAL_STAGE_TAG } from "../Constants/securestoreKey";
import { globalNavigationService } from "../Ref";
import { TagCheck } from "../Types/InitialSteps";
import normalAxios from "../Utils/normalAxios";

type UseTagFetchResponse = [
  tags: TagCheck[],
  setTags: React.Dispatch<React.SetStateAction<TagCheck[]>>,
  tagPageAdd: () => void,
  tagPageEnd: boolean,
  selectAll: boolean,
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectAllSwitcher: React.Dispatch<React.SetStateAction<boolean>>,
];

export default function useTagFetch(): UseTagFetchResponse {
  const [firstLoading, setFirstLoading] = useState(true);
  const [tags, setTags] = useState<TagCheck[]>([]);
  const [page, setPage] = useState(1);
  const [tagPageEnd, setTagPageEnd] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllSwitcher, setSelectAllSwitcher] = useState(false);

  // first loading check prev tags function
  async function firstLoadingCheck() {
    const prevTagJSON = await getItemAsync(INITIAL_STAGE_TAG);
    if (prevTagJSON && firstLoading) {
      setTags((prev) => [...prev, ...JSON.parse(prevTagJSON)]);
    }
    setFirstLoading(false);
  }

  //SECTION fetch tag data function
  async function fetchTagData() {
    if (tags.length > 0 && page === 1) {
      globalNavigationService("InitialSteps")?.navigate("SelectFoodScreen", { selectAll: selectAll, tags: tags, tagIds: tags.map(tag => tag.id) });
    }
    try {
      // NOTE API request
      const response = await normalAxios({
        method: 'post',
        url: `${TagAPI}/?take=20&page=${page}`,
        data: {
          excludes: tags.map((tag) => tag.id),
        },
      })

      // NOTE check if the list reached the end
      if (response.data.data.tags.length <= 0) {
        setTagPageEnd(true);
        return;
      }

      // NOTE add checked property into tag as false on default
      setTags((prev) => {
        const newState = [...prev, ...response.data.data.tags.map((tag: TagCheck) => {
          return { ...tag, checked: selectAll };
        })];
        return newState;
      })

    } catch (error) {
      console.log("useTagFetch:", error);
    }
  }
  // !SECTION

  // NOTE page add function
  function tagPageAdd() {
    if (!tagPageEnd) {
      setPage(prev => prev + 1);
    }
  }

  // ANCHOR control FlatList with page change
  useEffect(() => {
    if(firstLoading){
      firstLoadingCheck()
    }else if (!tagPageEnd && !firstLoading) {
      fetchTagData();
    }else{
      console.log(`firstLoading: ${firstLoading}, tagPageEnd: ${tagPageEnd}, reached the end of tag list`)
    }
  }, [page, firstLoading])


  // FIXME when selectAll is true, set all tags checked property as true
  // double flag needed to prevent infinite loop
  useEffect(()=>{
    console.log(`selectAll ${selectAll}`);
    if(!firstLoading){
      setTags(prev => {
        const newState = prev.map(tag => {
          return {...tag, checked: selectAll};
        })
        return newState;
      });
    }
  }, [selectAllSwitcher])

  // monitor tags change
  useEffect(() => {
    if(tags.length > 0){
      const allSelected = tags.every(tag => tag.checked === true);
      setSelectAll(allSelected);
    }
  }, [tags]);


  return [tags, setTags, tagPageAdd, tagPageEnd, selectAll, setSelectAll, setSelectAllSwitcher]
}