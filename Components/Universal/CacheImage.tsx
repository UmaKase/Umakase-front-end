import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import shortHash from "shorthash2";
import axios from "axios";
type Props = {
  url: string;
  style?: StyleProp<ImageStyle>;
};
const CacheImage: React.FC<Props> = ({ url, style }) => {
  // const url = "https://www.rspb.org.uk/globalassets/images/birds-and-wildlife/non-bird-species-illustrations/fox_1200x675.jpg";
  // fetching stage
  const [fetching, setFetching] = useState(true);
  // image source state
  const [source, setSource] = useState<string>();
  // when component did mount
  const componentDidMount = async () => {
    const fileName = shortHash(url);
    const path = `${FileSystem.cacheDirectory}${fileName}`;
    console.log(path);
    const image = await FileSystem.getInfoAsync(path);
    // ANCHOR find image in cache ============================================
    if (image.exists) {
      console.log("read image from cache...");
      setSource(image.uri);
      return;
    }
    // ANCHOR doesn't find image in cache ====================================
    console.log("downloading image to cache...");
    console.log("URL:", url);
    const newImage = await FileSystem.downloadAsync(url, path);
    console.log("result: ", newImage.status);
    setSource(newImage.uri);
    // prepared axios function for if needed ==================
    // axios({
    //   method: "get",
    //   responseType: "blob",
    //   url: url,
    // })
    //   .then(async (res) => {
    //     console.log("URL:" + URL.createObjectURL(res.data));
    //     const newImage = await FileSystem.downloadAsync(
    //       URL.createObjectURL(res.data),
    //       path
    //     );
    //     setSource(newImage.uri);
    //   })
    //   .catch((e) => {
    //     console.log("this is error :" + e);
    //   });
  };
  // ANCHOR fetching data ====================================
  useEffect(() => {
    componentDidMount();
    return () => {
      setFetching(true);
    };
  }, [url]);
  // ANCHOR end fetching  ====================================
  useEffect(() => {
    if (source) {
      setFetching(false);
    }
  }, [source]);

  return fetching ? (
    <ActivityIndicator size="large" color="#FFF" style={styles.centerObject} />
  ) : source ? (
    <Image source={{ uri: url }} style={style} />
  ) : (
    <Text style={styles.centerObject}>no image</Text>
  );
};

export default CacheImage;

const styles = StyleSheet.create({
  centerObject: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
});
