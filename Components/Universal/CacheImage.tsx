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
  // const url = "https://www.rspb.org.uk/globalassets/images/birds-and-wildlife/non-bird-species-illustrations/fox_1200x675.jpg";
  // fetching stage
  const [fetching, setFetching] = useState(true);
  // image source state
  const [source, setSource] = useState<string>();
  // when component did mount
  const cacheImage = async () => {
    const fileName = shortHash(url);
    const path = `${FileSystem.cacheDirectory}${fileName}`;
    const image = await FileSystem.getInfoAsync(path);
    // ANCHOR find image in cache ============================================
    if (!image.exists) {
      // ANCHOR doesn't find image in cache ====================================
      const newImage = await FileSystem.downloadAsync(url, path); // setSource(image.uri);
      return newImage.uri;
    }
    return image.uri;
  };

  useEffect(() => {
    cacheImage().then((uri) => {
      setFetching(false);
      setSource(uri);
    });
  }, []);

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
