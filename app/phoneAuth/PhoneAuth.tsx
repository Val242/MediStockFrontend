import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PhoneAuth = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Phone Authentication</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1D2E",
  },
});

export default PhoneAuth;
