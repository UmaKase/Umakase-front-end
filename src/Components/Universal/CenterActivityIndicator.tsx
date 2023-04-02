import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";

type Props = {
  size: number | "small" | "large";
  color: string;
};
const CenterActivityIndicator: React.FC<Props> = ({ size, color }) => {
  return (
    <ActivityIndicator size={size} color={color} style={styles.indicator} />
  );
};

export default CenterActivityIndicator;

const styles = StyleSheet.create({
  indicator: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
});
