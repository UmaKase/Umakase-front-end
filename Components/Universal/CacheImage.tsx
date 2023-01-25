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
type Props = {
  url: string;
  style?: StyleProp<ImageStyle>;
};
const CacheImage: React.FC<Props> = ({ url, style }) => {
  // fetching stage
  const [fetching, setFetching] = useState(true);
  // image source state
  const [source, setSource] = useState<string>();
  // when component did mount
  const cacheImage = async () => {
    const encodeUrl = encodeURI(url); //make sure the url not effect by the text language in it
    const fileName = shortHash(encodeUrl);
    const path = `${FileSystem.cacheDirectory}${fileName}`;
    const image = await FileSystem.getInfoAsync(path);
    // ANCHOR find image in cache ============================================
    if (!image.exists) {
      // ANCHOR doesn't find image in cache ====================================
      const newImage = await FileSystem.downloadAsync(encodeUrl, path);
      return newImage.uri;
    }
    return image.uri;
  };

  useEffect(() => {
    cacheImage().then((uri) => {
      setFetching(false);
      setSource(uri);
    });
    return console.log("refetching img...");
  }, [url]);

  return fetching ? (
    <ActivityIndicator size="large" color="#FFF" style={styles.centerObject} />
  ) : source ? (
    <Image source={{ uri: source }} style={style} />
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
